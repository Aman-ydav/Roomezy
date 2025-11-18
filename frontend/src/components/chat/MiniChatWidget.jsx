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
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [open, user, receiverId, isSelf]);

  if (isSelf) return null; // don't show mini chat if viewing own post

  return (
    <div className="fixed bottom-10 right-4 z-40">
      {/* Floating Chat Button */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-md border border-primary"
        >
          <MessageCircle size={22} />
        </motion.button>
      )}

      {/* Chat Box */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.2 }}
            className="w-80 h-[420px] bg-card border border-border shadow-xl rounded-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background">
              <div className="flex items-center gap-2">
                {receiver ? (
                  <>
                    <img
                      src={
                        receiver.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          receiver.userName || "User"
                        )}`
                      }
                      className="w-8 h-8 rounded-full border border-border object-cover"
                      alt={receiver.userName}
                    />
                    <div className="flex flex-col">
                      <p className="text-xs font-semibold">
                        {receiver.userName}
                      </p>
                      <span className="text-[10px] text-green-600">
                        Online
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <MessageCircle className="text-primary" size={18} />
                    <p className="font-semibold text-xs">Chat with post owner</p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-muted"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    // optional: also clear state if you want
                  }}
                  className="p-1 rounded hover:bg-muted"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden bg-background">
              {!user && (
                <div className="h-full flex flex-col items-center justify-center px-4 text-center text-sm text-muted-foreground">
                  <MessageCircle size={32} className="mb-2" />
                  Please login to start chatting with the post owner.
                  <Button variant="link" className="mb-2">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              )}

              {user && loading && (
                <Loader/>
              )}

              {user && !loading && conversationId && receiver && (
                <ChatWindow
                  user={user}
                  receiver={receiver}
                  conversationId={conversationId}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
