import schedule from "node-schedule";
import Scheduler from "./scheduler.js";
import { redisCli } from "../connect.js";
import FormResponse from "../form-response/form-response.model.js";

export default class FormResponseUpdateScheduler extends Scheduler {
	static isWorking = false;

	static init() {
		schedule.scheduleJob("*/5 * * * * *", async () => {
			const formResponseUpdateListLength = await redisCli.hLen("form-response-update");
			if (!this.isWorking && formResponseUpdateListLength) {
				this.isWorking = true;

				const formResponseUpdateList = await redisCli.hGetAll("form-response-update");

				await Promise.all(
					Object.keys(formResponseUpdateList).map((formResponseId) => {
						return new Promise((res, rej) => {
							const answersString = formResponseUpdateList[formResponseId];

							FormResponse.exists({ _id: formResponseId }).then(async (result) => {
								if (result) {
									// 응답지가 DB에 존재하는 경우
									// findOneAndUpdate 진행
									const answers = JSON.parse(answersString);
									await FormResponse.findOneAndUpdate({ _id: formResponseId }, answers).exec();

									if (answersString === (await redisCli.hGet("form-response-update", formResponseId))) {
										// 해당 responseId로 새로운 수정 사항이 생겼는지 확인
										// 만약 새로운 수정 사항이 없다면 redis에서 삭제
										// 만약 새로운 수정 사항이 있다면 다음 작업에서 처리하도록 남겨둠
										await redisCli.hDel("form-response-update", formResponseId);
									}
								} else {
									// 응답지가 아직 DB에 존재하지 않는 경우
									// findOneAndUpdate 메소드를 적용할 수 없으므로
									// 이번 작업에서는 처리하지 않고, 다음 작업으로 미룸
									await redisCli.hSet("form-response-update", formResponseId, answersString);
								}
								res();
							});
						});
					})
				);

				this.isWorking = false;
				console.log("update job done");
			}
		});
	}
}
