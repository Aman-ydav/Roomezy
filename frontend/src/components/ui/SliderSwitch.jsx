import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SliderSwitch() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(
    location.pathname === "/feed" ? "feed" : "home"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  // Initialize based on current route
  useEffect(() => {
    if (location.pathname === "/feed") {
      setActiveTab("feed");
      setDragProgress(100);
    } else {
      setActiveTab("home");
      setDragProgress(0);
    }
  }, [location.pathname]);

  const switchTab = (tab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setDragProgress(tab === "home" ? 0 : 100);

    if (tab === "home") navigate("/");
    else navigate("/feed");
  };

  const handleDragStart = () => setIsDragging(true);

  const handleDrag = (event, info) => {
    if (!isDragging || !containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const dragDistance = info.offset.x;
    const dragPercentage = (dragDistance / containerWidth) * 100;

    let newProgress;
    if (activeTab === "home") {
      newProgress = Math.max(0, Math.min(100, dragPercentage));
    } else {
      newProgress = Math.max(0, Math.min(100, 100 + dragPercentage));
    }

    setDragProgress(newProgress);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    let targetTab = activeTab;

    if (dragProgress > 50) targetTab = "feed";
    else if (dragProgress < 50) targetTab = "home";

    setDragProgress(targetTab === "home" ? 0 : 100);

    if (targetTab !== activeTab) switchTab(targetTab);
  };

  const handleClick = (event) => {
    if (isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const half = rect.width / 2;

    if (clickX < half) switchTab("home");
    else switchTab("feed");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-6">
      <motion.div
        ref={containerRef}
        className="relative bg-muted/30 rounded-2xl p-1 cursor-pointer select-none group"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Slider WITH MOVING ARROWS */}
        <motion.div
          className="absolute top-1 left-1 h-[calc(100%-8px)] bg-primary shadow-lg flex items-center justify-center"
          style={{
            width: "calc(50% - 4px)",
            borderRadius: "12px",
            x: `${dragProgress}%`,
          }}
          transition={
            isDragging
              ? { type: "tween", duration: 0 }
              : { type: "spring", stiffness: 500, damping: 30 }
          }
        >
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="right"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="text-primary-foreground text-2xl absolute end-3"
              >
               {"›››"}

              </motion.div>
            )}

            {activeTab === "feed" && (
              <motion.div
                key="left"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-primary-foreground text-2xl absolute start-3"
              >
                {"‹‹‹"}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Glow effect during drag */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Buttons (unchanged) */}
        <div className="relative z-10 flex text-sm">
          <button
            type="button"
            className={`flex items-center justify-between flex-1 py-2 px-4 font-medium relative z-20 ${
              activeTab === "home"
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }`}
            style={{
              borderTopLeftRadius: "12px",
              borderBottomLeftRadius: "12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              switchTab("home");
            }}
          >
            <span className="text-lg font-bold opacity-0"></span>
            Rooms
            <span className="text-lg font-bold opacity-0"></span>
          </button>

          <button
            type="button"
            className={`flex items-center justify-between flex-1 py-2.5 px-4 font-medium relative z-20 ${
              activeTab === "feed"
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }`}
            style={{
              borderTopRightRadius: "12px",
              borderBottomRightRadius: "12px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              switchTab("feed");
            }}
          >
            <span className="text-lg font-bold opacity-0"></span>
            Stories
            <span className="text-lg font-bold opacity-0"></span>
          </button>
        </div>

        {/* Slide hint */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2.5 py-1">
            <span className="text-[11px] font-medium">
              {isDragging ? "Release to switch" : "Slide to switch"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
