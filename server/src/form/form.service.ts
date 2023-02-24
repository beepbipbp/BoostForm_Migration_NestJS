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

    const rawFormList = await this.formRepository.findFormListWithCursor(userId, cursor);

    const formList = rawFormList.map((form) => {
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
    const lastId = formList.at(-1)?._id;

    return {
      form: formList,
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
    const rawForm = await this.formRepository.getForm(formId);

    if (!rawForm) {
      throw new NotFoundException();
    }

    const rawQuestions = rawForm.questions;
    const questions = rawQuestions?.map((question) => {
      return {
        questionId: question.question_order,
        type: question.question_type,
        essential: question.essential,
        etcAdded: question.etc_added,
        title: question.question_title,
        option: question.question_options,
      };
    });

    const form = {
      id: `${rawForm._id}`,
      userID: rawForm.author_id,
      title: rawForm.form_title,
      description: rawForm.form_description,
      category: rawForm.form_category,
      questionList: questions ? questions : [],
      acceptResponse: rawForm.accept_response,
      onBoard: rawForm.on_board,
      loginRequired: rawForm.login_required,
      responseCount: rawForm.response_count,
      responseModifiable: rawForm.response_modifiable,
      createdAt: rawForm.createdAt,
      updatedAt: rawForm.updatedAt,
    };

    return form;
  }

  async updateForm(formId: string, formRequestDto: FormRequestDto) {
    const questionRequestDtos = formRequestDto.questionList;

    const questions = questionRequestDtos
      ? questionRequestDtos.map((questionRequestDto) => {
          return {
            question_order: questionRequestDto.questionId,
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
}
