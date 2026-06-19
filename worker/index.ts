/// <reference lib="webworker" />
export {};

// Next.js includes lib.dom.d.ts which types `self` as `Window & typeof globalThis`.
// Cast explicitly so TypeScript resolves the correct ServiceWorker API types.
const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (event) => {
  if (!event.data) return;

  const payload = event.data.json() as {
    title: string;
    body: string;
    data?: { type?: string; notificationId?: string };
  };

  event.waitUntil(
    sw.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/MyGymBro-192.png',
      badge: '/icons/MyGymBro-192.png',
      data: { url: '/notifications', ...payload.data },
    }),
  );
});

sw.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notifData = event.notification.data as { url?: string } | null;
  const url = notifData?.url ?? '/notifications';

  event.waitUntil(
    sw.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          // matchAll with type:'window' always returns WindowClient instances
          const windowClient = client as WindowClient;
          if (windowClient.url.includes(sw.location.origin)) {
            return windowClient.focus();
          }
        }
        return sw.clients.openWindow(url);
      }),
  );
});
