import mongoose, { model, Schema } from "mongoose";

export interface WebPushSubscriptionDocument {
  _id: string;
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const WebPushSubscriptionSchema = new Schema<WebPushSubscriptionDocument>({
  userId: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
    unique: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
});
export default mongoose.models?.WebPushSubscription ||
  model<WebPushSubscriptionDocument>(
    "WebPushSubscription",
    WebPushSubscriptionSchema,
  );
