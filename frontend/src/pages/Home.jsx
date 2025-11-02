import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center mt-20"
    >
      <h1 className="text-4xl font-bold mb-4">Welcome Home</h1>
      <p className="text-gray-500 mb-6">Your professional React setup is ready!</p>
      <Button>
        <Mail className="w-4 h-4 mr-2 inline" />
        Contact Us
      </Button>
    </motion.div>
  );
}
