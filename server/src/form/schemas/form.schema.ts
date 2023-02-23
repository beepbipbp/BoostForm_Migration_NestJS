import { Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Form extends Document {}
