import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarCoachmark({ targetRef }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const seen = localStorage.getItem("seenSidebarCoachmark");
    if (seen) return;

    // DO NOT RUN ON DESKTOP
    if (window.innerWidth >= 1024) return;

    if (targetRef?.current) {
      const rect = targetRef.current.getBoundingClientRect();

      const padding = 6;       // mobile only
      const tooltipOffset = 10;

      const top = rect.top - padding + window.scrollY;
      const left = rect.left - padding + window.scrollX;
      const width = rect.width + padding * 2;
      const height = rect.height + padding * 2;

      setPos({ top, left, width, height, tooltipOffset });
      setShow(true);

      setTimeout(() => {
        setShow(false);
        localStorage.setItem("seenSidebarCoachmark", "true");
      }, 2100);
    }
  }, [targetRef]);

  if (!pos) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-9999"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className="absolute rounded-full border-2 border-white shadow-[0_0_18px_6px_rgba(255,255,255,0.6)]"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              height: pos.height,
            }}
          />

          <div
            className="absolute text-white text-xs bg-black/80 px-3 py-1 rounded-lg shadow-lg"
            style={{
              top: pos.top + pos.height + pos.tooltipOffset,
              left: pos.left,
            }}
          >
            Tap here to open sidebar
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
