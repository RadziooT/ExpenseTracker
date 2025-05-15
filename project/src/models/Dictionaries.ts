import mongoose, { model, Schema } from "mongoose";
import TimeData from "@/models/TimeData";

export interface DictionaryDocument extends TimeData {
  _id: string;
  CODE: string;
  VALUES: string[];
}

const DictionariesSchema = new Schema<DictionaryDocument>(
  {
    CODE: {
      type: String,
      unique: true,
      required: [true, "Dictionary code is required"],
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models?.Dictionary ||
  model<DictionaryDocument>("Dictionary", DictionariesSchema);
