// src/components/chat/MiniChatWidget.jsx
import { useState, useEffect } from "react";
import { MessageCircle, Minus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Loader from "@/components/layout/Loader";
import ChatWindow from "@/components/chat/ChatWindow"; // Fix import path
import { createConversation } from "@/utils/chatApi";

export default function MiniChatWidget({ receiverId }) {
  const user = useSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSelf = user && String(user._id) === String(receiverId);

  useEffect(() => {
    if (!open || !user || !receiverId || isSelf) return;

    async function loadConversation() {
      setLoading(true);
      try {
        const res = await createConversation({
          senderId: user._id,
          receiverId,
        });

        const convo = res.data.data;
        setConversation(convo);
      } catch (error) {
        console.error("Failed to create conversation:", error);
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [open, user, receiverId, isSelf]);

  if (isSelf) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg border border-primary/20 transition-all duration-200 relative group"
        >
          <MessageCircle size={22} />
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-30"></span>
        </motion.button>
      )}

      {/* Chat Box */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-80 h-96 bg-card border border-border/50 shadow-2xl rounded-xl flex flex-col overflow-hidden backdrop-blur-sm"
          >
            {/* Header */}
            {/* <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/95">
              <div className="flex items-center gap-2">
                <MessageCircle className="text-primary" size={18} />
                <p className="font-semibold text-sm">Quick Chat</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setConversation(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div> */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/95">
              <div className="flex items-center gap-2">
                <MessageCircle className="text-primary" size={18} />
                <p className="font-semibold text-sm">Chat</p>
              </div>

              <div className="flex items-center gap-1">
                {/* Add Open Full Chat Button Here */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2 mr-1 bg-primary text-background "
                >
                  <Link
                    to="/inbox"
                    state={{
                      forceOpen: true,
                      receiverId: receiverId,
                      openConversationId: conversation?._id,
                    }}
                    onClick={() => setOpen(false)}
                  >
                    Full Chat
                  </Link>
                </Button>

                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setConversation(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-hidden">
              {!user && (
                <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                  <MessageCircle
                    size={32}
                    className="text-muted-foreground mb-3"
                  />
                  <p className="text-sm text-muted-foreground mb-4">
                    Please login to start chatting
                  </p>
                  <Button asChild variant="default" size="sm">
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              )}

              {user && loading && (
                <div className="h-full flex items-center justify-center">
                  <Loader />
                </div>
              )}

              {user && !loading && conversation && (
                <ChatWindow
                  conversation={conversation}
                  currentUser={user}
                  onBack={() => setOpen(false)}
                  compact={true}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
