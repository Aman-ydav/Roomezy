// src/hooks/useAppVisibility.js
import { useEffect, useState } from "react";

export default function useAppVisibility() {
  const [visible, setVisible] = useState(
    document.visibilityState === "visible"
  );

  useEffect(() => {
    const update = () => {
      const nowVisible = document.visibilityState === "visible";
      setVisible(nowVisible);

      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage(
          nowVisible ? "CLIENT_VISIBLE" : "CLIENT_HIDDEN"
        );
      }
    };

    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}
