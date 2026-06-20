/// <reference lib="webworker" />

// `self` in a SW context is ServiceWorkerGlobalScope, but the DOM lib types it as
// `Window & typeof globalThis`. Cast once here so all subsequent calls are typed correctly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sw = (self as any) as ServiceWorkerGlobalScope;

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
          const windowClient = client as WindowClient;
          if (windowClient.url.includes(sw.location.origin)) {
            return windowClient.focus();
          }
        }
        return sw.clients.openWindow(url);
      }),
  );
});
