import FormResponseSaveScheduler from "./schedulers/form-response-save.scheduler.js";
import CountIncreaseScheduler from "./schedulers/CountIncreaseScheduler.js";
import ResponseUpdateScheduler from "./schedulers/ResponseUpdateScheduler.js";

try {
	FormResponseSaveScheduler.init();
	CountIncreaseScheduler.init();
	ResponseUpdateScheduler.init();
} catch (err) {
	console.log(err);
}
