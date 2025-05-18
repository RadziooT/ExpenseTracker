import { defaultCache } from "@serwist/next/worker";
import { NavigationRoute, PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { getAllTransactions } from "@/services/frontendDb/transactionService";
import { QueryData } from "@/actions/internal/ChartQuery";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

self.addEventListener("push", (event) => {
  const data = JSON.parse(event.data?.text() ?? '{ title: "" }');
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: "/icons/app-icon-192x192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow("/");
      }),
  );
});

self.addEventListener("fetch", (event) => {
  console.log(`Intercepted fetch request with url: ${event.request.url}`);
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  console.log(`Intercepted fetch request with url: ${request.url}`);

  if (request.url.includes("/transactions")) {
    console.log("here?");

    event.respondWith(
      (async () => {
        let response: Response;
        let data: any;
        try {
          response = await fetch(request);
          data = await response.json();
          console.log(data);
        } catch (error) {
          if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
          ) {
            data = await getAllTransactions();
            data = data.map((transaction: any) => transaction.entry);
          }
        }
        console.log(data);
        return new Response(JSON.stringify(data), { status: 200 });
      })(),
    );
    return; // prevent falling through
  }
});

serwist.addEventListeners();
