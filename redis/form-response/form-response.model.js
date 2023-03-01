import mongoose from "mongoose";
import { FormResponseSchema } from "./form-response.schema.js";

const FormResponse = mongoose.model("FormResponse", FormResponseSchema);

export default FormResponse;
