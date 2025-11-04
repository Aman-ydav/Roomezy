import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export function SonnerToaster() {
  const { mode } = useSelector((state) => state.theme); // get theme from Redux
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(mode === "dark" ? "dark" : "light");
  }, [mode]);

  return (
    <Toaster
      position="top-right"
      richColors
      expand
      closeButton={false}
      theme={theme} 
      duration={2000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl shadow-lg border border-border bg-background text-foreground transition-all duration-300 hover:scale-[1.02]",
          title: "text-xs text-base",
          description: "text-[2px] opacity-90",
          closeButton:
            "ml-2 text-muted-foreground hover:text-foreground focus:outline-none",
          icon: "text-sm",
        },
      }}
    />
  );
}
