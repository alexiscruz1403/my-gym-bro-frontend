declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  const { title, body, data } = event.data.json() as {
    title: string;
    body: string;
    data?: { type?: string; notificationId?: string };
  };

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/MyGymBro-192.png',
      badge: '/icons/MyGymBro-192.png',
      data: { url: '/notifications', ...data },
    }),
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const url: string =
    (event.notification.data as { url?: string } | null)?.url ?? '/notifications';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});
