import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-background text-foreground">
      {/* Glowing Gradient Orbs (Brand Colors) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl"
      />

      {/* Subtle moving background aura */}
      <motion.div
        animate={{
          x: [0, 15, -15, 0],
          y: [0, 10, -10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-linear-to-br from-muted/10 via-background to-accent/10"
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Big 404 text */}
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[7rem] sm:text-[10rem] font-extrabold leading-none bg-primary bg-clip-text text-transparent drop-shadow-xl"
        >
          404
        </motion.h1>

        {/* Message */}
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground font-medium max-w-lg">
          Oops! It seems the page you’re looking for has drifted away from Roomezy.
        </p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <Link to="/">
            <Button
              size="lg"
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-full bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Faint overlay gradient for depth */}
      <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-background/80 pointer-events-none" />
    </div>
  )
}
