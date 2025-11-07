import { motion } from "framer-motion";
import { MessageSquare, Clock, Send } from "lucide-react";

export default function Inbox() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden opacity-60">
        {/* Chat Bubble Animation Layer */}
        <div className="absolute inset-0 flex flex-col gap-3 px-6 py-10 animate-pulse">
          <div className="self-start bg-primary/25 dark:bg-primary/30 text-foreground/90 max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm backdrop-blur-md">
            Hey! 👋 I just saw your listing.
          </div>
          <div className="self-end bg-card/70 border border-border/50 text-foreground/90 max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm backdrop-blur-md">
            Hi! Great! Are you looking for a roommate?
          </div>
          <div className="self-start bg-primary/25 dark:bg-primary/30 text-foreground/90 max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm backdrop-blur-md">
            Yep! I’d love to connect and know more about the room.
          </div>
          <div className="self-end bg-card/70 border border-border/50 text-foreground/90 max-w-[60%] rounded-2xl px-4 py-2 text-sm shadow-sm backdrop-blur-md">
            Perfect. Let’s chat here soon!
          </div>
        </div>

        {/* Fixed Gradient Overlay for Visibility */}
        <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/70 to-background/95 backdrop-blur-[2px]"></div>
      </div>

      {/* Foreground Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg text-center bg-card/80 backdrop-blur-xl border border-border/40 shadow-2xl rounded-3xl p-10 flex flex-col items-center"
      >
        {/* Icon & Title */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="bg-primary/10 p-6 rounded-full mb-5">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">
            Roomezy Chat App — Coming Soon 
          </h1>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            We’re building an intuitive chat system to help users connect,
            discuss rooms, and share updates in real time — securely and easily.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Feature under active development</span>
          </div>
        </motion.div>

        {/* Placeholder “chat input” mock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 w-full bg-muted/60 border border-border/30 rounded-full flex items-center px-4 py-2 shadow-inner backdrop-blur-sm"
        >
          <input
            type="text"
            placeholder="Type a message..."
            disabled
            className="flex-1 bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/70 outline-none"
          />
          <Send className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </div>
  );
}
