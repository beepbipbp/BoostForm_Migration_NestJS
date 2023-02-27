import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PAGE_SIZE, SELECTED_FIELDS } from "src/board/consts/board.consts";
import { SearchQueryForRepository } from "src/board/interfaces/board.interface";
import { SortQueryForRepository } from "src/board/types/board.type";
import { Form } from "./schemas/form.schema";

@Injectable()
export class FormRepository {
  constructor(@InjectModel(Form.name) private readonly formModel: Model<Form>) {}

  async findFormListWithCursor(userId: string, cursor: string) {
    const formList =
      cursor === "empty"
        ? await this.formModel.find({ author_id: userId }).sort({ _id: -1 }).limit(5).lean().exec()
        : await this.formModel
            .find({ author_id: userId, _id: { $lt: cursor } })
            .sort({ _id: -1 })
            .limit(5)
            .lean()
            .exec();

    return formList;
  }

  async createNewForm(userId: string) {
    const newForm = new this.formModel();
    newForm.author_id = userId;
    await newForm.save();

    return newForm.id;
  }

  async getForm(formId: string) {
    const form = await this.formModel.findById(formId).lean().exec();

    return form;
  }

  async updateForm(formId: string, updatedForm: Form) {
    await this.formModel.findOneAndUpdate({ _id: formId }, updatedForm);
  }

  async deleteForm(formId: string) {
    await this.formModel.deleteOne({ _id: formId });
  }

  async findFormListForBoard(
    searchQuery: SearchQueryForRepository,
    sortQuery: SortQueryForRepository,
    pageNumber: number,
  ) {
    const formList = await this.formModel
      .find(searchQuery, SELECTED_FIELDS)
      .sort(sortQuery)
      .skip((pageNumber - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean()
      .exec();

    return formList;
  }

  async getTotalCountForBoard(searchQuery: SearchQueryForRepository) {
    const totalCount = await this.formModel.count(searchQuery).exec();

    return totalCount;
  }
}
