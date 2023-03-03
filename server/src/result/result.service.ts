import { BadRequestException, Injectable } from "@nestjs/common";
import { LeanDocument } from "mongoose";
import { FormResponseRepository } from "src/form-response/form-response.repository";
import { Answer } from "src/form-response/schemas/answer.schema";
import { FormResponse } from "src/form-response/schemas/form-response.schema";
import { FormRepository } from "src/form/form.repository";
import { Form } from "src/form/schemas/form.schema";
import { Question } from "src/form/schemas/question.schema";
import { AnswerTotal, QuestionResult, QuestionResultDictionary, Result } from "./interfaces/result.interface";

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

    this.completeResult(result, formResponseList);

    return result;
  }

  initQuestionResultDictionaray(form: LeanDocument<Form>) {
    const questionResultDictionary = new Object();
    form.questions.forEach((question: LeanDocument<Question>) => {
      question[question.question_id] = {
        type: question.question_type,
        questionTitle: question.question_title,
        responseCount: 0,
        answerTotal: this.initAnswerTotal(question),
      } as QuestionResult;
    });

    return questionResultDictionary as QuestionResultDictionary;
  }

  initAnswerTotal(question: LeanDocument<Question>) {
    const answerTotal = new Object();
    question.question_options.forEach((questionOption) => {
      answerTotal[questionOption] = 0;
    });

    return answerTotal as AnswerTotal;
  }

  completeResult(result: Result, formResponseList: LeanDocument<FormResponse>[]) {
    formResponseList.forEach((formResponse) => this.aggregateFormResponse(result, formResponse));
  }

  aggregateFormResponse(result: Result, formResponse: LeanDocument<FormResponse>) {
    formResponse.answers.forEach((answer: Answer) => this.aggregateAnswer(result, answer));
  }
}
