import { useState, useEffect } from "react";
import { MessageCircle, Minus, X } from "lucide-react";
import ChatWindow from "./ChatWindow";
import { createConversation } from "@/utils/chatApi";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";

export default function MiniChatWidget({ receiverId }) {
  const user = useSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [receiver, setReceiver] = useState(null);
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
        setConversationId(convo._id);

        const partner = convo.participants.find(
          (p) => String(p._id) !== String(user._id)
        );
        setReceiver(partner);
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
          {/* Pulse animation */}
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/95 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0">
                {receiver ? (
                  <>
                    <div className="relative shrink-0">
                      <img
                        src={
                          receiver.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            receiver.userName || "User"
                          )}&background=primary&color=fff`
                        }
                        className="w-8 h-8 rounded-full border border-border object-cover"
                        alt={receiver.userName}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {receiver.userName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        Online
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="text-primary" size={16} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">Start Chat</p>
                      <span className="text-xs text-muted-foreground">
                        Post owner
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors duration-150"
                  aria-label="Minimize chat"
                >
                  <Minus size={14} className="text-muted-foreground" />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    setConversationId(null);
                    setReceiver(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors duration-150"
                  aria-label="Close chat"
                >
                  <X size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden bg-background/95 backdrop-blur-sm">
              {!user && (
                <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <MessageCircle size={24} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please login to start chatting with the post owner
                  </p>
                  <Button asChild variant="default" size="sm">
                    <Link to="/login" className="text-xs">
                      Sign In to Chat
                    </Link>
                  </Button>
                </div>
              )}

              {user && loading && (
                <div className="h-full flex items-center justify-center">
                  <Loader />
                </div>
              )}

              {user && !loading && conversationId && receiver && (
                <ChatWindow
                  user={user}
                  receiver={receiver}
                  conversationId={conversationId}
                  compact={true}
                />
              )}

              {user && !loading && !conversationId && !loading && (
                <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <MessageCircle size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unable to start conversation
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 text-xs"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}