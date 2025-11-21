import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/features/theme/themeSlice.js";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => dispatch(toggleTheme())}
      className={`
        p-2 rounded-md
        text-gray-600 dark:text-gray-400
        hover:text-gray-900 dark:hover:text-white
        transition-colors duration-150
        focus:outline-none
      `}
      aria-label="Toggle theme"
    >
      {mode === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;