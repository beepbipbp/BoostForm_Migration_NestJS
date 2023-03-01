import mongoose from "mongoose";
import { FormSchema } from "./form.schema.js";

const Form = mongoose.model("Form", FormSchema);

export default Form;
