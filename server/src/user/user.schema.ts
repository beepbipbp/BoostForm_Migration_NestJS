import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString } from "class-validator";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @Prop({
    type: String,
  })
  @IsString()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
