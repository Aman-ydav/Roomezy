import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary text-background py-7 md:py-10 px-6 md:px-10 max-w-7xl mx-auto mt-10 shadow-md">
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-background/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-primary-foreground"
        >
          Finding Room/Roommate Made Easy with <br />
          <span className="text-primary-foreground underline underline-offset-4 decoration-background/30">
            Roomezy
          </span>
        </motion.h1>

         <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-base md:text-lg text-primary-foreground/60 max-w-2xl leading-relaxed"
        >
          Free to list, search & connect.
        </motion.p>


        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onClick={() => navigate("/create-post")}
          className="group relative inline-flex items-center justify-center gap-2 rounded-lg border border-background/30 bg-primary-foreground text-primary font-semibold px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg hover:bg-transparent hover:text-primary-foreground transition-all duration-300 ease-out cursor-pointer shadow-sm hover:shadow-lg"
        >
          Need a Room or Roommate?
          <span className="absolute inset-0 rounded-lg border border-background/10 group-hover:border-background/40 transition-all duration-300" />
        </motion.button>

       
      </div>
    </section>
  );
}
