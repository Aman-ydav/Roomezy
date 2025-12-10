let clientVisible = false;

self.addEventListener("message", (event) => {
  if (event.data?.type === "VISIBILITY") {
    clientVisible = event.data.visible;
  }
});


self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data.json();
  } catch (e) {}

  if (clientVisible) {
    // client visible → NO push
    event.waitUntil(Promise.resolve());
    return;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/logo.png",
      data: {
        conversationId: data.conversationId,
      },
    })
  );
});


self.addEventListener("install", (event) => {
  console.log("Roomezy SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Roomezy SW activated");
  return self.clients.claim();
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const { conversationId } = event.notification.data;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {
      for (const client of clientList) {
        client.focus();
        client.postMessage({
          type: "OPEN_CONVERSATION",
          conversationId,
        });
        return;
      }
      return clients.openWindow("/inbox").then((newClient) => {
        newClient.postMessage({
          type: "OPEN_CONVERSATION",
          conversationId,
        });
      });
    })
  );
});
