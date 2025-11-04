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
      position="top-left"
      richColors
      expand
      closeButton={false}
      theme={theme}
      duration={2500}
      offset={{ top: 62, left: 10 }}
      toastOptions={{
        style: {
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "0.95rem",
          fontWeight: 500,
          boxShadow:
            theme === "dark"
              ? "0 4px 14px rgba(255, 255, 255, 0.1)"
              : "0 4px 14px rgba(0, 0, 0, 0.1)",
          
        }
      }}
    />
  );
}
