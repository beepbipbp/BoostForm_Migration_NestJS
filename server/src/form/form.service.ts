import { Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import getDateString from "src/common/utils/getDateString";
import { UserRepository } from "src/user/user.repository";
import { User } from "src/user/user.schema";
import { FormRepository } from "./form.repository";

@Injectable()
export class FormService {
  constructor(private readonly formRepository: FormRepository, private readonly userRepository: UserRepository) {}

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
}
