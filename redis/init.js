import ResponseSaveScheduler from "./schedulers/ResponseSaveScheduler.js";
import CountIncreaseScheduler from "./schedulers/CountIncreaseScheduler.js";
import ResponseUpdateScheduler from "./schedulers/ResponseUpdateScheduler.js";

try {
	ResponseSaveScheduler.init();
	CountIncreaseScheduler.init();
	ResponseUpdateScheduler.init();
} catch (err) {
	console.log(err);
}
