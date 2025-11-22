// src/features/chat/components/ChatLayout.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const user = useSelector((s) => s.auth.user);
  const conversations = useSelector((s) => s.chat.conversations); // Move useSelector here
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openConversationId) {
      // Find the conversation in Redux store
      const conversation = conversations.find(
        (c) => c._id === location.state.openConversationId
      );

      if (conversation) {
        setSelectedConversation(conversation);
      } else {
        // Create a temporary conversation object
        setSelectedConversation({
          _id: location.state.openConversationId,
          participants: [user, { _id: location.state.receiverId }],
          lastMessage: null,
          unreadCount: {},
        });
      }

      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, user, conversations]); // Add conversations to dependencies

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageCircle size={50} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Please login to chat</h3>
          <p className="text-muted-foreground text-lg">
            Sign in to start messaging with other users
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Conversation List - Always visible on desktop, conditional on mobile */}
      <div className={`
        ${selectedConversation ? 'hidden lg:flex' : 'flex'} 
        w-full lg:w-96 flex-col border-r border-border
      `}>
        <ConversationList
          onSelectConversation={setSelectedConversation}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Chat Window - Takes full remaining space */}
      <AnimatePresence mode="wait">
        {selectedConversation ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <ChatWindow
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
              currentUser={user}
            />
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 hidden lg:flex items-center justify-center bg-muted/10"
          >
            <div className="text-center p-8 max-w-md">
              <MessageCircle size={50} className="mx-auto text-muted-foreground mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Select a conversation</h3>
              <p className="text-muted-foreground text-lg">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}