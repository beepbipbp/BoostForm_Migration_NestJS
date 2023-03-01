import mongoose from "mongoose";
import { FormResponseSchema } from "./form-response.schema.js";

const FormResponse = mongoose.model("Response", FormResponseSchema);

export default FormResponse;
