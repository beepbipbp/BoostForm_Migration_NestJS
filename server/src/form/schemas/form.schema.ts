import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsBoolean, IsEmpty, IsEnum, IsNumber, IsString, MaxLength } from "class-validator";
import { Document } from "mongoose";
import { formCategoryList } from "../consts/form.consts";
import { formCategoryEnum } from "../enums/form-category.enum";
import { Question } from "./question.schema";

@Schema({ timestamps: true })
export class Form extends Document {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  @IsEmpty()
  @IsString()
  author_id: string;

  @Prop({
    type: String,
    maxlength: 100,
    default: "제목 없음",
  })
  @IsString()
  @MaxLength(100)
  form_title: string;

  @Prop({
    type: String,
    maxlength: 100,
  })
  @IsString()
  @MaxLength(100)
  form_description: string;

  @Prop({
    type: String,
    enum: formCategoryList,
    default: "기타",
  })
  @IsString()
  @IsEnum(formCategoryEnum)
  form_category: string;

  @Prop({
    type: Array<Question>,
  })
  questions: Question[];

  @Prop({
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  accept_response: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  on_board: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  login_required: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  response_modifiable: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  @IsNumber()
  response_count: number;

  createdAt: Date;
  updatedAt: Date;
}

export const FormSchema = SchemaFactory.createForClass(Form);
