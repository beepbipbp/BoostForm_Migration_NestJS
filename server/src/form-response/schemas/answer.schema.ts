import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmpty, IsString } from "class-validator";
import { Document } from "mongoose";

@Schema()
export class Answer extends Document {
  @Prop({
    type: Number,
    required: true,
  })
  @IsEmpty()
  question_id: number;

  @Prop({
    type: [String],
  })
  @IsString({
    each: true,
  })
  selected_options: string[];
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
