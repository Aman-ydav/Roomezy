import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loader({ text = "Processing..." }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 0.6,
          ease: "linear",
        }}
      >
        <Loader2 className="w-5 h-5 text-primary-foreground" />
      </motion.div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
