import mongoose from "mongoose";

export const AnswerSchema = new mongoose.Schema({
	question_id: {
		type: Number,
		required: true,
	},
	selected_options: {
		type: [String],
	},
});

export const FormResponseSchema = new mongoose.Schema({
	respondent_id: {
		type: String,
	},
	form_id: {
		type: String,
		required: true,
		index: true,
	},
	answers: {
		type: [AnswerSchema],
	},
});
