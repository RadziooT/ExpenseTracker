"use client";

import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/userContextProvider";
import { Switch } from "@heroui/react";
import Loading from "@/components/global/Loading";

const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function SendNotification() {
  const { userId, isUserAuthenticated } = useUserContext();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.serwist !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (
            sub &&
            !(
              sub.expirationTime &&
              Date.now() > sub.expirationTime - 5 * 60 * 1000
            )
          ) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

  const subscribeNotifications = async () => {
    setIsLoading(true);
    if (!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY) {
      setIsLoading(false);
      throw new Error("Environment variables supplied not sufficient.");
    }
    if (!registration) {
      setIsLoading(false);
      console.error("No SW registration available.");
      return;
    }
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      ),
    });

    try {
      await fetch("/api/notification/subscription", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
          subscription: sub,
        }),
        signal: AbortSignal.timeout(10000),
      });

      setSubscription(subscription);
      setIsSubscribed(true);
      alert("Web push subscribed!");
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "TimeoutError") {
          console.error("Timeout: It took too long to get the result.");
        } else if (err.name === "AbortError") {
          console.error(
            "Fetch aborted by user action (browser stop button, closing tab, etc.)",
          );
        } else if (err.name === "TypeError") {
          console.error("The AbortSignal.timeout() method is not supported.");
        } else {
          // A network error, or some other problem.
          console.error(`Error: type: ${err.name}, message: ${err.message}`);
        }
      } else {
        console.error(err);
      }
      alert("An error happened.");
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeNotifications = async () => {
    setIsLoading(true);
    if (!subscription) {
      console.error("Web push not subscribed");
      setIsLoading(false);
      return;
    }
    await subscription.unsubscribe();
    try {
      await fetch("/api/notification/subscription", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
        signal: AbortSignal.timeout(10000),
      });

      setSubscription(null);
      setIsSubscribed(false);
      console.log("Web push unsubscribed!");
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "TimeoutError") {
          console.error("Timeout: It took too long to get the result.");
        } else if (err.name === "AbortError") {
          console.error(
            "Fetch aborted by user action (browser stop button, closing tab, etc.)",
          );
        } else if (err.name === "TypeError") {
          console.error("The AbortSignal.timeout() method is not supported.");
        } else {
          // A network error, or some other problem.
          console.error(`Error: type: ${err.name}, message: ${err.message}`);
        }
      } else {
        console.error(err);
      }
      alert("An error happened.");
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionButtonCLicked = async () => {
    if (isSubscribed) {
      unsubscribeNotifications().then(() => setIsSubscribed(false));
    } else {
      subscribeNotifications().then(() => setIsSubscribed(true));
    }
  };

  if (isLoading) return <Loading loadingContent="Processing..." />;

  if (isUserAuthenticated)
    return (
      <div className="flex flex-col gap-2">
        <Switch
          isSelected={isSubscribed}
          onValueChange={() => subscriptionButtonCLicked()}
        >
          Notifications
        </Switch>
      </div>
    );
}
