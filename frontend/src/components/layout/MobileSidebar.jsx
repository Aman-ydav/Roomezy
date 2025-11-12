import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Sidebar from "./Sidebar";

export default function MobileSidebar({ open, setOpen }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-sidebar"
          initial={{ x: -260, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -260, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          ref={sidebarRef}
          className="
            fixed top-[60px] left-0
            h-[calc(100dvh-60px)] w-64
            bg-card/95 backdrop-blur-xl
            border-border shadow-xl
            z-60
            overflow-y-auto overflow-x-hidden
            transition-transform duration-300 ease-in-out
            will-change-transform
            scrollbar-hide::-webkit-scrollbar
          "
        >
          <Sidebar />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
