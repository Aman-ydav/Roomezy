import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/features/theme/themeSlice.js";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => dispatch(toggleTheme())}
      className={`
        relative flex items-center w-11 h-6
        rounded-full
        border border-border
        shadow-inner overflow-hidden
        bg-card text-primary
        transition-all duration-500
      `}
      aria-label="Toggle theme"
    >
      {/* Switch Track Glow */}
      <motion.div
        layout
        className={`absolute inset-0 rounded-full transition-colors duration-500 ${
          mode === "dark"
            ? "bg-linear-to-r from-red-600/30 to-red-300/50"
            : "bg-linear-to-r from-yellow-300/20 to-orange-300/20"
        }`}
      />

      {/* Sliding Knob */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`
          absolute top-1 left-1 w-4 h-4 rounded-full 
          shadow-lg flex items-center justify-center
          ${mode === "dark" ? "translate-x-5 bg-accent" : "bg-primary"}
          transition-all duration-500
        `}
      >
        <AnimatePresence mode="wait" initial={false}>
          {mode === "dark" ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              {/* Smaller on mobile, normal on desktop */}
              <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-background" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.3 }}
            >
              {/* Smaller on mobile, normal on desktop */}
              <Moon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-background" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
