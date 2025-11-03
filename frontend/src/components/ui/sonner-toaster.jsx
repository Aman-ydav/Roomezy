import { Toaster } from "sonner";

export function SonnerToaster() {
  let theme = "light";
  return (
    <Toaster
      position="top-right"
      richColors
      expand
      closeButton= {false}
      theme={theme}
      duration={3000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl shadow-lg border border-border bg-background text-foreground transition-all duration-300 hover:scale-[1.02]",
          title: "font-semibold text-base",
          description: "text-sm opacity-90",
          closeButton:
            "ml-2 text-muted-foreground hover:text-foreground focus:outline-none",
          icon: "text-lg",
        },
      }}
    />
  );
}
