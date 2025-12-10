import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import ThemeProvider from "./features/theme/ThemeProvider";
import App from "./App";
import "./index.css";

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then(() => console.log("SW registered"))
//       .catch((err) => console.log("SW failed", err));
//   });
// }

import { urlBase64ToUint8Array } from "./utils/vapid";

// --- INIT PUSH + PWA ---
async function initPushAndPWA() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("SW or Push not supported");
    return;
  }

  try {
    // 1) Register the service worker ONCE
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js"
    );
    console.log("SW registered:", registration);

    // 2) Ask permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    // 3) Create subscription
    const existingSub = await registration.pushManager.getSubscription();
    let subscription = existingSub;

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });
    }

    console.log("Push subscription:", subscription);

    // 4) Send subscription to backend (only if user logged in)
    const raw = localStorage.getItem("roomezy_tokens");
    let token = null;

    if (raw) {
      const parsed = JSON.parse(raw);
      token = parsed.accessToken;
    }

    if (!token) {
      console.log("No accessToken in localStorage. Login first, then refresh.");
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    console.log("Subscription sent to backend");
  } catch (err) {
    console.error("Error in initPushAndPWA", err);
  }
}

// Call once on load
initPushAndPWA();
// --- END PUSH + PWA ---

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
