import { type NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import WebPushSubscription from "@/models/WebPushSubscription";

export async function POST(req: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    !process.env.WEB_PUSH_EMAIL ||
    !process.env.WEB_PUSH_PRIVATE_KEY
  ) {
    throw new Error("Environment variables supplied not sufficient.");
  }
  const { title, content } = (await req.json()) as {
    title: string;
    content: string;
  };
  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY,
    );

    const subs = await WebPushSubscription.find();

    await Promise.allSettled(
      subs.map((subscription) =>
        webPush.sendNotification(
          subscription.subscriptionData,
          JSON.stringify({
            title: title ? title : "PWA Web Push",
            message: content ? content : "Push content was not provided",
          }),
        ),
      ),
    );

    return new NextResponse("");
  } catch (err) {
    if (err instanceof webPush.WebPushError) {
      return new NextResponse(err.body, {
        status: err.statusCode,
        headers: err.headers,
      });
    }
    console.log(err);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
