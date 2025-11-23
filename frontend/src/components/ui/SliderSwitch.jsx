// src/components/ui/SliderSwitch.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function SliderSwitch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/feed" ? "feed" : "home"
  );
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (location.pathname === "/feed") {
      setActiveTab("feed");
    } else if (location.pathname === "/") {
      setActiveTab("home");
    }
  }, [location.pathname]);

  const switchTab = (tab) => {
    if (isAnimating || tab === activeTab) return;

    setIsAnimating(true);
    setActiveTab(tab);

    if (tab === "home") {
      navigate("/");
    } else {
      navigate("/feed");
    }

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDragEnd = (event, info) => {
    const dragDistance = info.offset.x;

    // If drag distance is significant, consider it a swipe
    if (Math.abs(dragDistance) > 40) {
      if (dragDistance > 0 && activeTab === "home") {
        // Swipe right → go to Stories
        switchTab("feed");
      } else if (dragDistance < 0 && activeTab === "feed") {
        // Swipe left ← go to Rooms
        switchTab("home");
      }
    }
  };

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const half = rect.width / 2;

    if (clickX < half) {
      // Clicked on left side → Rooms
      switchTab("home");
    } else {
      // Clicked on right side → Stories (feed)
      switchTab("feed");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6 px-6">
      <motion.div
        className="relative bg-muted/30 rounded-2xl p-1 cursor-pointer select-none group"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Background Slider with Swipe Animation */}
        <motion.div
          className="absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] bg-primary shadow-lg"
          animate={{
            x: activeTab === "home" ? 0 : "100%",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
          style={{
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
            borderTopRightRadius: "12px",
            borderBottomRightRadius: "12px",
          }}
        />

        {/* Glow effect during animation */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Static buttons container (visual only, clicks handled by parent) */}
        <div className="relative z-10 flex text-sm">
          <button
            type="button"
            className={`flex-1 py-3 px-4 font-medium transition-all duration-200 relative z-20 ${
              activeTab === "home"
                ? "text-primary-foreground"
                : "text-muted-foreground group-hover:text-foreground/90"
            }`}
            style={{
              borderTopLeftRadius: "12px",
              borderBottomLeftRadius: "12px",
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
          >
            Rooms
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 font-medium transition-all duration-200 relative z-20 ${
              activeTab === "feed"
                ? "text-primary-foreground"
                : "text-muted-foreground group-hover:text-foreground/90"
            }`}
            style={{
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderTopRightRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
          >
            Stories
          </button>
        </div>

        {/* Slide hint with animation */}
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-40"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
            <motion.span
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ←
            </motion.span>
            <span className="text-[11px] font-medium bg-linear-to-r from-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              swipe to switch
            </span>
            <motion.span
              animate={{ x: [2, -2, 2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
