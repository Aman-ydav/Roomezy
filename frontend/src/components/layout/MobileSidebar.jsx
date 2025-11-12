import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Sidebar from "./Sidebar";

export default function MobileSidebar({ open, setOpen }) {
  const sidebarRef = useRef(null);

  // Close sidebar on outside click
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
        
          initial={{ x: -260, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -260, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          ref={sidebarRef}
           className="
            fixed top-16 left-0
            h-[calc(100dvh-64px)] w-64      
            bg-card/95 backdrop-blur-xl
            border-r border-border shadow-xl
            z-50
            overflow-y-auto overflow-x-hidden   
            rounded-tr-xl rounded-br-xl
          "
        >
          
          <Sidebar />
        </motion.div>
        
      )}
      
    </AnimatePresence>
  );
}
