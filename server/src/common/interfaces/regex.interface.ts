import { RegexOptions } from "mongoose";

export interface RegExForMongoose {
  $regex: string;
  $options: RegexOptions;
}
