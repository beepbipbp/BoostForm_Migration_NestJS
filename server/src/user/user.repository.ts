import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findUserByName(userName: string) {
    const user = await this.userModel.findOne({ user_name: userName });

    return user;
  }

  async signUp(userName: string) {
    const newUser = new this.userModel();
    newUser.user_name = userName;
    return await newUser.save();
  }

  async findUser(userId: string) {
    const user = await this.userModel.findById(userId);

    return user;
  }

  async checkUserExists(userId: string) {
    const user = await this.userModel.exists({ id: userId });

    if (user) {
      return true;
    }
    return false;
  }
}
