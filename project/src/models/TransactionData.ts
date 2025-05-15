import mongoose, { model, Schema } from "mongoose";
import TimeData from "@/models/TimeData";

export interface TransactionDataDocument extends TimeData {
  _id: string;
  userId: string;
  isExpense: boolean;
  title: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
}

const TransactionDataSchema = new Schema<TransactionDataDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    isExpense: {
      type: Boolean, // optionally use Boolean if that's intended
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    date: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models?.TransactionData ||
  model<TransactionDataDocument>("TransactionData", TransactionDataSchema);
