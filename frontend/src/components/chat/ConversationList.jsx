import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search, ChevronLeft } from "lucide-react";
import {
  setConversations,
  resetUnreadForConversation,
  newMessageAlert,
} from "@/features/chat/chatSlice";
import { getConversations, markAsRead } from "@/utils/chatApi";
import ConversationItem from "./ConversationItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/layout/Loader";
import { socket } from "@/socket/socket";
import { setCurrentUserId } from "@/features/chat/chatSlice";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

export default function ConversationList({
  onSelectConversation,
  selectedConversation,
  isMobile,
  onBack,
}) {
  const dispatch = useDispatch();
  const conversations = useSelector((s) => s.chat.conversations);
  const user = useSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.openChatWith) {
      const existingConvo = conversations.find((convo) =>
        convo.participants.some((p) => p._id === location.state.openChatWith)
      );

      if (existingConvo) {
        onSelectConversation(existingConvo);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, conversations, onSelectConversation]);
  useEffect(() => {
    if (user?._id) {
      dispatch(setCurrentUserId(user._id));
    }
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (!user?._id) return;

    const loadConversations = async () => {
      try {
        setLoading(true);
        const res = await getConversations(user._id);
        dispatch(setConversations(res.data.data || []));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (!user?._id) return;

    const handleNewMessageAlert = (data) => {
      dispatch(newMessageAlert(data));
    };

    socket.on("new-message-alert", handleNewMessageAlert);

    return () => {
      socket.off("new-message-alert", handleNewMessageAlert);
    };
  }, [user?._id, dispatch]);

  const filteredConversations = conversations.filter((convo) => {
    if (!searchTerm) return true;

    const partner = convo.participants.find((p) => p._id !== user._id);
    if (!partner) return false;

    return partner.userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleConversationClick = async (conversation) => {
    onSelectConversation(conversation);

    dispatch(resetUnreadForConversation(conversation._id));

    const unreadCount = conversation.unreadCount?.[user._id] || 0;
    if (unreadCount > 0) {
      try {
        await markAsRead(conversation._id, user._id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2"
            >
              <ChevronLeft size={20} />
            </Button>
          )}
          <h2 className="text-xl font-semibold flex-1">Messages</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center p-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-2">
              <Search size={20} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "No conversations found" : "No conversations yet"}
            </p>
            {!searchTerm && (
              <p className="text-xs text-muted-foreground mt-1">
                Start a new conversation to see it here
              </p>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {filteredConversations
              .sort(
                (a, b) =>
                  new Date(b?.lastMessageAt || b?.updatedAt || b?.createdAt) -
                  new Date(a?.lastMessageAt || a?.updatedAt || a?.createdAt)
              )
              .map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  conversation={conversation}
                  currentUserId={user._id}
                  isSelected={selectedConversation?._id === conversation._id}
                  onClick={() => handleConversationClick(conversation)}
                />
              ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
