// service-worker.js
let clientVisible = false;

self.addEventListener("message", (e) => {
  if (e.data === "CLIENT_VISIBLE") {
    clientVisible = true;
  } else if (e.data === "CLIENT_HIDDEN") {
    clientVisible = false;
  }
  console.log(
    "[SW] message from page:",
    e.data,
    "clientVisible =",
    clientVisible
  );
});

// PUSH: only show system notification when client is NOT visible
self.addEventListener("push", (event) => {
  try {
    const data = event.data && event.data.json ? event.data.json() : null;
    console.log("[SW] push received clientVisible =", clientVisible, data);

    if (!data) {
      event.waitUntil(Promise.resolve());
      return;
    }

    if (clientVisible) {
      // App is already visible → no system notification
      event.waitUntil(Promise.resolve());
      return;
    }

    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/logo.png",
        data: {
          url: data.url || "/inbox",
          conversationId: data.conversationId,
        },
      })
    );
  } catch (err) {
    console.error("SW push error", err);
  }
});

self.addEventListener("install", (event) => {
  console.log("Roomezy SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Roomezy SW activated");
  return self.clients.claim();
});

// CLICK ON NOTIFICATION
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { url, conversationId } = event.notification.data || {};

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.focus();
            client.postMessage({
              type: "OPEN_CONVERSATION",
              conversationId,
            });
            return;
          }
        }
        // No existing client tab → open /inbox (or provided url)
        return clients.openWindow(url || "/inbox").then((newClient) => {
          if (newClient) {
            newClient.postMessage({
              type: "OPEN_CONVERSATION",
              conversationId,
            });
          }
        });
      })
  );
});

// This second activate keeps your visibility sync behaviour
self.addEventListener("activate", (event) => {
  console.log("Roomezy SW activated (visibility sync)");

  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsList) {
        client.postMessage("REQUEST_VISIBILITY_STATE");
      }
    })()
  );

  return self.clients.claim();
});
