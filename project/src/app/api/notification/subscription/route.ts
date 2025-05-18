import { type NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WebPushSubscription from "@/models/WebPushSubscription";

export async function POST(req: NextRequest) {
  const { userId, subscription } = (await req.json()) as {
    userId: string;
    subscription: webPush.PushSubscription;
  };
  try {
    await connectDB();
    const userFound = await User.findOne({ _id: userId });

    if (!userFound) {
      return new NextResponse("User not found", {
        status: 500,
      });
    }

    const subscriptionData = new WebPushSubscription({
      userId: userId,
      subscriptionData: subscription,
    });
    await subscriptionData.save();

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

export async function DELETE(req: NextRequest) {
  const { userId } = (await req.json()) as {
    userId: string;
  };
  try {
    await connectDB();
    await WebPushSubscription.deleteMany({ userId });

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
