import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/user/user.schema";
import { Form } from "./schemas/form.schema";

@Injectable()
export class FormRepository {
  constructor(
    @InjectModel(Form.name) private readonly formModel: Model<Form>,
    @InjectModel(User.name) private readonly usemModel: Model<User>,
  ) {}

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
}
