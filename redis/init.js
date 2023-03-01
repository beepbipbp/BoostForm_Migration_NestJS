import FormResponseSaveScheduler from "./schedulers/form-response-save.scheduler.js";
import CountScheduler from "./schedulers/count.scheduler.js";
import FormResponseUpdateScheduler from "./schedulers/form-response-update.scheduler.js";

try {
	FormResponseSaveScheduler.init();
	CountScheduler.init();
	FormResponseUpdateScheduler.init();
} catch (err) {
	console.log(err);
}
