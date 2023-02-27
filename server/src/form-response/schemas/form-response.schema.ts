import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmpty, IsString } from "class-validator";
import { Document } from "mongoose";
import { Answer } from "./answer.schema";

@Schema()
export class FormResponse extends Document {
  @Prop({
    type: String,
  })
  @IsString()
  respondent_id: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  @IsEmpty()
  @IsString()
  form_id: string;

  @Prop({
    type: [Answer],
  })
  answer_list: Answer[];
}

export const FormResponseSchema = SchemaFactory.createForClass(FormResponse);
