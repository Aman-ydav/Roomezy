// src/components/ui/SliderSwitch.jsx (Fixed with Swipe Animation)
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function SliderSwitch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname === "/feed" ? "feed" : "home");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (location.pathname === "/feed") {
      setActiveTab("feed");
    } else if (location.pathname === "/") {
      setActiveTab("home");
    }
  }, [location.pathname]);

  const switchTab = (tab) => {
    if (isAnimating) return;
    
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

  const handleDrag = (event, info) => {
    // Only allow horizontal drag
    const dragDistance = info.offset.x;
    
    // If drag distance is significant, consider it a swipe
    if (Math.abs(dragDistance) > 60) {
      if (dragDistance > 0 && activeTab === "home") {
        // Swipe right → go to Feed
        switchTab("feed");
      } else if (dragDistance < 0 && activeTab === "feed") {
        // Swipe left ← go to Home
        switchTab("home");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 px-6">
      <motion.div 
        className="relative bg-muted/30 rounded-2xl p-1 cursor-pointer select-none group"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Background Slider with Swipe Animation */}
        <motion.div
          className="absolute top-1 left-1 w-1/2 h-[calc(100%-8px)] bg-primary shadow-lg"
          animate={{ 
            x: activeTab === "home" ? 0 : "100%",
            scale: isAnimating ? 1.02 : 1
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30,
            duration: 0.3
          }}
          style={{
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px'
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
        
        <div className="relative z-10 flex text-sm">
          <motion.button
            onClick={() => switchTab("home")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 px-4 font-medium transition-all duration-200 ${
              activeTab === "home" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={{
              borderTopLeftRadius: '12px',
              borderBottomLeftRadius: '12px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px'
            }}
          >
            Rooms
          </motion.button>
          <motion.button
            onClick={() => switchTab("feed")}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 px-4 font-medium transition-all duration-200 ${
              activeTab === "feed" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            style={{
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px'
            }}
          >
            Feed
          </motion.button>
        </div>

        {/* Enhanced Slide Hint with Animation */}
        <motion.div 
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-transparent px-3 py-1 rounded-full">
            <motion.span
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >←</motion.span>
            <span className="text-[10px] font-medium">swipe to switch</span>
            <motion.span
              animate={{ x: [2, -2, 2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >→</motion.span>
          </div>
        </motion.div>
      </motion.div>

     
    </div>
  );
}