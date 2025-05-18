import mongoose, { model, Schema } from "mongoose";

export interface WebPushSubscription {
  _id: string;
  userId: string;
  subscriptionData: { type: [Object]; default: [] };
}

const WebPushSubscriptionSchema = new Schema<WebPushSubscription>({
  userId: {
    type: String,
    required: true,
  },
  subscriptionData: {
    type: Object,
    default: [],
    required: true,
  },
});
export default mongoose.models?.WebPushSubscription ||
  model<WebPushSubscription>("WebPushSubscription", WebPushSubscriptionSchema);
