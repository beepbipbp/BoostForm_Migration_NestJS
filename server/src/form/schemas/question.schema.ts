import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Document } from "mongoose";
import { questionTypeEnum } from "../enums/question-type.enum";

@Schema()
export class Question extends Document {
  @Prop({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  question_order: number;

  @Prop({
    type: String,
    required: true,
    enum: ["checkbox", "multiple", "paragraph"],
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(questionTypeEnum)
  question_type: string;

  @Prop({
    type: String,
    default: "제목 없음",
  })
  @IsString()
  question_title: string;

  @Prop({
    type: [String],
  })
  @IsString({
    each: true,
  })
  question_options: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  is_essential: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  is_etc_added: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
