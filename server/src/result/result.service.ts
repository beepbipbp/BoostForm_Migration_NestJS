import { BadRequestException, Injectable } from "@nestjs/common";
import { LeanDocument } from "mongoose";
import { FormResponseRepository } from "src/form-response/form-response.repository";
import { FormRepository } from "src/form/form.repository";
import { Form } from "src/form/schemas/form.schema";

@Injectable()
export class ResultService {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly formResponseRepository: FormResponseRepository,
  ) {}

  async getResult(formId: string) {
    const form = await this.formRepository.findForm(formId);
    const formResponseList = await this.formResponseRepository.findFormResponseListByFormId(formId);

    if (!form) {
      throw new BadRequestException("Invalid form Id");
    }

    const result = {
      formTitle: form.form_title,
      totalResponseCount: form.response_count,
      acceptResponse: form.accept_response,
      questionResultDict: this.initQuestionResultDictionaray(form),
    };

    return result;
  }

  initQuestionResultDictionaray(form: LeanDocument<Form>) {}
}
