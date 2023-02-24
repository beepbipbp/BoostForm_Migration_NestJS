import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Document } from "mongoose";
import { questionTypeList } from "../consts/questions.consts";
import { questionTypeEnum } from "../enums/question-type.enum";

@Schema()
export class Question extends Document {
  @Prop({
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  question_id: number;

  @Prop({
    type: String,
    required: true,
    enum: questionTypeList,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(questionTypeEnum)
  question_type: string;

  @Prop({
    type: String,
    maxlength: 100,
    default: "제목 없음",
  })
  @IsString()
  @MaxLength(100)
  question_title: string;

  @Prop({
    type: [String],
  })
  @IsString({
    each: true,
  })
  @MaxLength(100, { each: true })
  question_options: string[];

  @Prop({
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  essential: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  etc_added: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
