import { defaultCache } from "@serwist/next/worker";
import { PrecacheEntry, Serwist, SerwistGlobalConfig } from "serwist";
import { getAllTransactions } from "@/services/frontendDb/transactionService";
import TransactionData from "@/types/transactionData";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
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
  const { request } = event;

  if (request.url.includes("/transactions/list")) {
    event.respondWith(
      (async () => {
        const clonedRequest = event.request.clone();
        let response: Response;
        let data: any;
        try {
          response = await fetch(request);
          data = await response.json();
        } catch (error) {
          if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
          ) {
            data = await getAllTransactions();
            const dateRange = await clonedRequest.json();
            const dateFrom = new Date(dateRange.dateFrom);
            const dateTo = new Date(dateRange.dateTo);

            data = data.map((transaction: any) => transaction.entry);
            data = data.filter((item: TransactionData) => {
              const itemDate = new Date(item.date);
              return itemDate >= dateFrom && itemDate <= dateTo;
            });
          }
        }
        return new Response(JSON.stringify(data), { status: 200 });
      })(),
    );
    return;
  }
});

serwist.addEventListeners();
