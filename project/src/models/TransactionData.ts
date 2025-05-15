import mongoose, { model, Schema } from "mongoose";
import TimeData from "@/models/TimeData";

export interface TransactionDataDocument extends TimeData {
  _id: string;
  userId: string;
  isExpense: string;
  title: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
}

const TransactionDataSchema = new Schema<TransactionDataDocument>(
  {},
  {
    timestamps: true,
  },
);
export default mongoose.models?.TransactionData ||
  model<TransactionDataDocument>("TransactionData", TransactionDataSchema);
