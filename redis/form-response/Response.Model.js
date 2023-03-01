import mongoose from "mongoose";
import { FormResponseSchema } from "./Response.Schema.js";

const FormResponse = mongoose.model("Response", FormResponseSchema);

export default FormResponse;
