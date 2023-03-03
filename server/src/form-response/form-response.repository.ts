import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AnswerRequestDto } from "./interfaces/answer-dto.interface";
import { Answer } from "./schemas/answer.schema";
import { FormResponse } from "./schemas/form-response.schema";

@Injectable()
export class FormResponseRepository {
  constructor(@InjectModel(FormResponse.name) private readonly formResponseModel: Model<FormResponse>) {}

  async findFormResponseByUserId(userId: string, formId: string) {
    const response = await this.formResponseModel.findOne({ respondent_id: userId, form_id: formId }).lean().exec();

    return response;
  }

  makeNewFormResponse(userId: string | undefined, formId: string, answers: Answer[]) {
    const newResponse = new this.formResponseModel({ respondent_id: userId, form_id: formId, answers });

    return newResponse;
  }

  async findFormResponse(formResponseId: string) {
    const formResponse = await this.formResponseModel.findById(formResponseId);

    return formResponse;
  }

  async findFormResponseListByFormId(formId: string) {
    const formResponseList = await this.formResponseModel.find({ form_id: formId }).lean().exec();

    return formResponseList;
  }
}
