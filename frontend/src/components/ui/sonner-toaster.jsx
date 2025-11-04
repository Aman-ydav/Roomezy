import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export function SonnerToaster() {
  const { mode } = useSelector((state) => state.theme);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(mode === "dark" ? "dark" : "light");
  }, [mode]);

  return (
    <Toaster
      position="bottom-right"
      richColors
      expand
      closeButton={false}
      theme={theme}
      duration={3000}
      toastOptions={{
        className:
          "shadow-lg rounded-xl border border-border/40 backdrop-blur-md transition-all duration-300",
        style: {
          background:
            theme === "dark"
              ? "linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)"
              : "linear-gradient(135deg, #ffffff 0%, #F8F5F3 100%)",
          color: "var(--foreground)",
          fontFamily: "Quicksand",
          fontWeight: 500,
          letterSpacing: "0.3px",
        },
        descriptionClassName: "text-sm opacity-80",
        success: {
          style: {
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #2E8A8A 0%, #3BB273 100%)"
                : "linear-gradient(135deg, #3BB273 0%, #2E8A8A 100%)",
            color: "#fff",
          },
        },
        error: {
          style: {
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #762d36 0%, #D64545 100%)"
                : "linear-gradient(135deg, #D64545 0%, #A35D68 100%)",
            color: "#fff",
          },
        },
        warning: {
          style: {
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #C6A15B 0%, #A35D68 100%)"
                : "linear-gradient(135deg, #F4C95D 0%, #A35D68 100%)",
            color: "#1A1A1A",
          },
        },
        info: {
          style: {
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #722F37 0%, #A35D68 100%)"
                : "linear-gradient(135deg, #A35D68 0%, #C58A8A 100%)",
            color: "#fff",
          },
        },
      }}
    />
  );
}
