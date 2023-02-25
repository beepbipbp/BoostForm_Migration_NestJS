import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Redis } from "ioredis";
import getDateString from "src/common/utils/getDateString";
import { UserRepository } from "src/user/user.repository";
import { FormRepository } from "./form.repository";
import { FormRequestDto } from "./interfaces/form-dto.interface";
import { Form } from "./schemas/form.schema";
import { Question } from "./schemas/question.schema";

@Injectable()
export class FormService {
  constructor(
    private readonly formRepository: FormRepository,
    private readonly userRepository: UserRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getFormList(userId: string, cursor: string) {
    const isUserExists = await this.userRepository.checkUserExists(userId);

    if (!isUserExists) {
      throw new NotFoundException();
    }

    const formList = await this.formRepository.findFormListWithCursor(userId, cursor);

    const formListForResponse = formList.map((form) => {
      return {
        _id: `${form._id}`,
        title: form.form_title,
        acceptResponse: form.accept_response,
        updatedAt: getDateString(form.updatedAt),
        onBoard: form.on_board,
        category: form.form_category,
        response: form.response_count,
      };
    });
    const lastId = formListForResponse.at(-1)?._id;

    return {
      form: formListForResponse,
      lastId,
    };
  }

  async createNewForm(userId: string) {
    const isUserExists = await this.userRepository.checkUserExists(userId);

    if (!isUserExists) {
      throw new NotFoundException();
    }

    const formId = await this.formRepository.createNewForm(userId);

    return { formId };
  }

  async getForm(formId: string) {
    const form = await this.formRepository.getForm(formId);

    if (!form) {
      throw new NotFoundException();
    }

    const questions = form.questions;
    const questionsForResponse = questions?.map((question) => {
      return {
        questionId: question.question_id,
        type: question.question_type,
        essential: question.essential,
        etcAdded: question.etc_added,
        title: question.question_title,
        option: question.question_options,
      };
    });

    const formForResponse = {
      id: `${form._id}`,
      userID: form.author_id,
      title: form.form_title,
      description: form.form_description,
      category: form.form_category,
      questionList: questions ? questions : [],
      acceptResponse: form.accept_response,
      onBoard: form.on_board,
      loginRequired: form.login_required,
      responseCount: form.response_count,
      responseModifiable: form.response_modifiable,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    };

    return formForResponse;
  }

  async updateForm(formId: string, formRequestDto: FormRequestDto) {
    const questionRequestDtos = formRequestDto.questionList;

    const questions = questionRequestDtos
      ? questionRequestDtos.map((questionRequestDto) => {
          return {
            question_id: questionRequestDto.questionId,
            question_type: questionRequestDto.type,
            question_title: questionRequestDto.title,
            question_options: questionRequestDto.option,
            essential: questionRequestDto.essential,
            etc_added: questionRequestDto.etcAdded,
          } as Question;
        })
      : [];

    const updatedForm = {
      form_title: formRequestDto.title,
      form_description: formRequestDto.description,
      form_category: formRequestDto.category,
      questions,
      accept_response: formRequestDto.acceptResponse,
      on_board: formRequestDto.onBoard,
      login_required: formRequestDto.loginRequired,
      response_modifiable: formRequestDto.responseModifiable,
    } as Form;

    await this.formRepository.updateForm(formId, updatedForm);
  }

  async updateFormToRedis(formId: string) {
    const form = await this.getForm(formId);

    this.redis.set(`form:${formId}`, JSON.stringify(form), "EX", 300);
  }

  async deleteForm(formId: string) {
    await this.formRepository.deleteForm(formId);
  }
}
