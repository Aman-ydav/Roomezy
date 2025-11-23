// src/components/layout/BottomNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Image, Plus, User, Search } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      id: "home", 
      label: "Rooms", 
      icon: Home, 
      path: "/",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "feed", 
      label: "Feed", 
      icon: Image, 
      path: "/feed",
      color: "from-purple-500 to-purple-600"
    },
    { 
      id: "create", 
      label: "Create", 
      icon: Plus, 
      path: "/create",
      color: "from-green-500 to-green-600",
      special: true
    },
    { 
      id: "search", 
      label: "Search", 
      icon: Search, 
      path: "/search",
      color: "from-orange-500 to-orange-600"
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: User, 
      path: "/profile",
      color: "from-pink-500 to-pink-600"
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (item) => {
    if (item.id === "create") {
      // Handle create post logic here
      console.log("Create new post");
      return;
    }
    navigate(item.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-gray-200/60 shadow-2xl">
      <div className="max-w-lg mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            if (item.special) {
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative -top-6"
                >
                  <div className="relative">
                    <div className={`h-14 w-14 bg-linear-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/30`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-white/20 rounded-2xl" />
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className="flex flex-col items-center gap-1 relative"
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Icon 
                    className={`h-6 w-6 transition-all duration-300 ${
                      active 
                        ? `text-transparent bg-linear-to-br ${item.color} bg-clip-text` 
                        : "text-gray-400"
                    }`}
                  />
                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-linear-to-r ${item.color} rounded-full`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
                <span className={`text-xs font-medium transition-all duration-300 ${
                  active 
                    ? `text-transparent bg-linear-to-br ${item.color} bg-clip-text font-semibold` 
                    : "text-gray-500"
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-4 bg-transparent" />
    </div>
  );
}