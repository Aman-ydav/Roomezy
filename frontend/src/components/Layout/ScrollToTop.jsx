import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  // Show button after scrolling 300px
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll smoothly to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-9999 flex items-center justify-center 
        w-12 h-12 rounded-full shadow-lg cursor-pointer
        bg-primary text-primary-foreground transition-all duration-300
        hover:scale-110 hover:shadow-xl hover:bg-accent
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
      `}
      title="Go to top"
    >
      <ChevronUp className="w-6 h-6 animate-bounce-slow" />
    </div>
  );
}
