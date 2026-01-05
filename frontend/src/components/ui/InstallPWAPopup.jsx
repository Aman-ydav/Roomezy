import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

let deferredPrompt = null;

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
    navigator.userAgent
  );
}

function shouldShowPopup() {
  const count = Number(localStorage.getItem("roomezy_visits") || 0) + 1;
  localStorage.setItem("roomezy_visits", count);
  return count % 10 === 0;
}

export default function InstallPWAPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); 
      deferredPrompt = e;

      if (isMobile() && shouldShowPopup()) {
        setShow(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); 
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-card border border-border rounded-xl p-4 shadow-lg">
      <p className="text-sm text-foreground mb-3">
        Install <strong>Roomezy</strong> for a faster, app-like experience.
      </p>

      <div className="flex gap-3">
        <Button className="flex-1" onClick={handleInstall}>
          Install App
        </Button>

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShow(false)}
        >
          Not now
        </Button>
      </div>
    </div>
  );
}
