/* eslint-disable no-console */
import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default function connectMongoDB() {
  mongoose.connect(process.env.MONGODB_URL as string, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("mongoDB is connected...");
    }
  });
}
