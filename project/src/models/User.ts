import mongoose, { model, Schema } from "mongoose";
import TimeData from "@/models/TimeData";

export interface UserDocument extends TimeData {
  _id: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      required: [true, "Name is required"],
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models?.User || model<UserDocument>("User", UserSchema);
