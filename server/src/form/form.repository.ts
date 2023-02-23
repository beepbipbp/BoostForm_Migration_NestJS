import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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
}
