import schedule from "node-schedule";
import Scheduler from "./scheduler.js";
import { redisCli } from "../connect.js";
import FormResponse from "../form-response/form-response.model.js";

export default class FormResponseSaveScheduler extends Scheduler {
	static isWorking = false;

	static init() {
		schedule.scheduleJob("*/30 * * * * *", async () => {
			const formResponseSaveListLength = await redisCli.hLen("form-response");
			if (!this.isWorking && formResponseSaveListLength) {
				this.isWorking = true;

				const formResponseSaveList = await redisCli.hGetAll("form-response");

				await Promise.all(
					Object.keys(formResponseSaveList).map((formResponseId) => {
						return new Promise(async (res, rej) => {
							const formResponseObj = JSON.parse(formResponseSaveList[formResponseId]);
							const response = new FormResponse(formResponseObj);

							response.save().then(redisCli.hDel("form-response", formResponseId)).then(res());
						});
					})
				);

				this.isWorking = false;
				console.log("save job done");
			}
		});
	}
}
