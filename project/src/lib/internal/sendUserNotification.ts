import webPush from "web-push";
import WebPushSubscription, {
  WebPushSubscriptionDocument,
} from "@/models/WebPushSubscription";

export async function sendUserNotification({
  userId,
  title,
  message,
}: {
  userId: string;
  title: string;
  message: string;
}) {
  if (
    !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    !process.env.WEB_PUSH_EMAIL ||
    !process.env.WEB_PUSH_PRIVATE_KEY
  ) {
    console.log("Environment variables supplied not sufficient.");
    return;
  }
  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY,
    );

    const userSubscriptions: Array<WebPushSubscriptionDocument> =
      await WebPushSubscription.find({
        userId,
      });

    await Promise.allSettled(
      userSubscriptions.map((subscription) =>
        webPush.sendNotification(
          {
            keys: subscription.keys,
            endpoint: subscription.endpoint,
          },
          JSON.stringify({
            title: title,
            message: message,
          }),
        ),
      ),
    );
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}
