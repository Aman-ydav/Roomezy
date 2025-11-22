import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { createConversation } from "@/utils/chatApi";
import { toast } from "sonner";

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle force opening a chat from location state - SIMPLIFIED VERSION
  useEffect(() => {
    const handleForceOpen = async () => {
      const { 
        forceOpen, 
        receiverId, 
        openConversationId 
      } = location.state || {};

      console.log("Force open params:", { forceOpen, receiverId, openConversationId });

      if (!forceOpen || !receiverId || !user) return;

      // Don't open chat with self
      if (receiverId === user._id) {
        toast.error("Cannot chat with yourself");
        navigate(location.pathname, { replace: true, state: {} });
        return;
      }

      try {
        setLoading(true);

        // If we have a specific conversation ID, try to find it in existing conversations
        if (openConversationId) {
          const targetConversation = conversations.find(conv => conv._id === openConversationId);
          if (targetConversation) {
            console.log("Found existing conversation:", targetConversation);
            setSelectedConversation(targetConversation);
            navigate(location.pathname, { replace: true, state: {} });
            return;
          }
        }

        // Check if conversation already exists with this user
        const existingConvo = conversations.find(conv => 
          conv.participants.some(p => p._id === receiverId)
        );

        if (existingConvo) {
          console.log("Found conversation with user:", existingConvo);
          setSelectedConversation(existingConvo);
        } else {
          console.log("Creating new conversation with:", receiverId);
          // Create a new conversation
          const response = await createConversation({
            senderId: user._id,
            receiverId: receiverId,
          });
          
          const newConversation = response.data.data;
          console.log("Created new conversation:", newConversation);
          setSelectedConversation(newConversation);
          // Add to conversations list
          setConversations(prev => [newConversation, ...prev]);
        }

        // Clear the state to prevent reopening
        navigate(location.pathname, { replace: true, state: {} });

      } catch (error) {
        console.error("Failed to open chat:", error);
        toast.error("Failed to open chat");
      } finally {
        setLoading(false);
      }
    };

    // Only run if we have forceOpen in state
    if (location.state?.forceOpen) {
      console.log("Force open detected, processing...");
      handleForceOpen();
    }
  }, [location.state, user, conversations, navigate, location.pathname]);

  // Update conversations when ConversationList loads them
  const handleConversationsUpdate = (conversationsList) => {
    console.log("Conversations updated:", conversationsList);
    setConversations(conversationsList);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

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
          onSelectConversation={handleSelectConversation}
          selectedConversation={selectedConversation}
          onConversationsUpdate={handleConversationsUpdate}
          isMobile={false}
          onBack={handleBack}
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
              onBack={handleBack}
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
              <h3 className="text-2xl font-semibold mb-4">
                {loading ? "Opening Chat..." : "Select a conversation"}
              </h3>
              <p className="text-muted-foreground text-lg">
                {loading 
                  ? "Please wait while we open your chat..." 
                  : "Choose a chat from the sidebar to start messaging"
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}