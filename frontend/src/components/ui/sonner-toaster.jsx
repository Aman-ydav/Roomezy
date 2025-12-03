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
      position="top-center"
      richColors
      expand
      closeButton={false}
      theme={theme}
      duration={2500}
      offset={{ top: 70 }}
      toastOptions={{
        style: {
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "0.9rem",
          fontWeight: 500,
          maxWidth: "250px",
          width: "90%",
          margin: "0 auto",
          boxShadow:
            theme === "dark"
              ? "0 4px 14px rgba(255, 255, 255, 0.1)"
              : "0 4px 14px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
  );
}
