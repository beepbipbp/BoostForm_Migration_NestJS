import schedule from "node-schedule";
import Scheduler from "./scheduler.js";
import { redisCli } from "../connect.js";
import Form from "../form/form.model.js";

export default class CountScheduler extends Scheduler {
	static isWorking = false;

	static init() {
		schedule.scheduleJob("*/5 * * * * *", async () => {
			const countListLength = await redisCli.hLen("count");
			if (!this.isWorking && countListLength) {
				this.isWorking = true;

				const countList = await redisCli.hGetAll("count");

				await Promise.all(
					Object.keys(countList).map((formId) => {
						return new Promise((res, rej) => {
							const count = Number(countList[formId]);

							Form.findOneAndUpdate({ _id: formId }, { $inc: { response_count: count } })
								.exec()
								.then(redisCli.hIncrBy("count", formId, -count))
								.then(async () => {
									if ((await redisCli.hGet("count", formId)) === "0") {
										await redisCli.hDel("count", formId);
									}
									res();
								});
						});
					})
				);

				this.isWorking = false;
				console.log("count job done");
			}
		});
	}
}
