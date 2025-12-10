self.addEventListener("install", (event) => {
  console.log("Roomezy SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Roomezy SW activated");
  return self.clients.claim();
});

// HANDLE PUSH NOTIFICATIONS
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data.body,
    icon: "/logo.png",
    badge: "/logo.png",
    data: data.url,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// CLICK ON NOTIFICATION
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
