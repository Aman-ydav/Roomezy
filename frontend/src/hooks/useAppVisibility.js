// src/hooks/useAppVisibility.js
import { useEffect, useState } from "react";

const bc = new BroadcastChannel("visibility");

export default function useAppVisibility() {
  const [visible, setVisible] = useState(document.visibilityState === "visible");

  useEffect(() => {
    const update = () => {
      const isVisible = document.visibilityState === "visible";
      setVisible(isVisible);

      // Send to SW
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "VISIBILITY",
          visible: isVisible
        });
      }

      // Send to all browser contexts
      bc.postMessage({
        type: "VISIBILITY",
        visible: isVisible
      });
    };

    document.addEventListener("visibilitychange", update);
    update();

    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}
