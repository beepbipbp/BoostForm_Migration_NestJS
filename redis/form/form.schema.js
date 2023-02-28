import mongoose from "mongoose";
import { questionTypeList, formCategoryList } from "./form.const.js";

const QuestionSchema = new mongoose.Schema({
	question_id: {
		type: Number,
		required: true,
	},
	question_type: {
		type: String,
		required: true,
		enum: questionTypeList,
	},
	question_title: {
		type: String,
		maxLength: 100,
		default: "제목 없음",
	},
	question_options: {
		type: [String],
	},
	essential: {
		type: Boolean,
		default: false,
	},
	etc_added: {
		type: Boolean,
		default: false,
	},
});

const FormSchema = new mongoose.Schema(
	{
		author_id: {
			type: Number,
			required: true,
			index: true,
		},
		form_title: {
			type: String,
			maxLength: 100,
			default: "제목 없음",
		},
		form_description: {
			type: String,
			maxLength: 100,
		},
		form_category: {
			type: String,
			enum: formCategoryList,
			default: "기타",
		},
		questions: {
			type: [QuestionSchema],
		},
		accept_response: {
			type: Boolean,
			default: false,
		},
		on_board: {
			type: Boolean,
			default: false,
		},
		login_required: {
			type: Boolean,
			default: false,
		},
		response_modifiable: {
			type: Boolean,
			default: true,
		},
		response_count: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

export { QuestionSchema, FormSchema };
