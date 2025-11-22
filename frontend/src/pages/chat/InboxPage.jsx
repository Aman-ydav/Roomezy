import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getConversations, createConversation } from "@/utils/chatApi";
import {
  setConversations,
  setCurrentUserId,
  newMessageAlert,
  resetUnreadForConversation,
} from "@/features/chat/chatSlice";
import { socket } from "@/socket/socket";

import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";

import { ArrowLeft } from "lucide-react";

export default function InboxPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const conversations = useSelector((s) => s.chat.conversations);

  const [activeConversation, setActiveConversation] = useState(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Set user id in slice
  useEffect(() => {
    if (user?._id) dispatch(setCurrentUserId(user._id));
  }, [user]);

  // Fetch conversation list
  useEffect(() => {
    if (!user) return;

    getConversations(user._id).then((res) => {
      dispatch(setConversations(res.data.data));
    });
  }, [user?._id]);

  // Handle socket new-message-alert
  useEffect(() => {
    const handler = (payload) => {
      dispatch(newMessageAlert(payload));
    };
    socket.on("new-message-alert", handler);

    return () => socket.off("new-message-alert", handler);
  }, []);

  // Set active conversation
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    dispatch(resetUnreadForConversation(conversation._id));
  };

  // Partner object
  const partner =
    activeConversation &&
    activeConversation.participants.find(
      (p) => String(p._id) !== String(user?._id)
    );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Please login to use chat.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-background flex overflow-hidden">

      {/* LEFT SIDE – Conversation List */}
      <div className="w-full md:w-[340px] border-r border-border bg-card flex flex-col">

        {/* HEADER */}
        <div className="px-4 py-3 border-b border-border bg-card/95 backdrop-blur-sm shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">Chats</h1>
        </div>

        {/* SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            currentUserId={user._id}
            activeConversationId={activeConversation?._id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>

      {/* RIGHT SIDE – DESKTOP CHAT */}
      <div className="hidden md:flex flex-1 flex-col bg-background">
        {activeConversation && partner ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-border bg-card/90 backdrop-blur-sm flex items-center gap-3 shadow-sm">
              <img
                src={
                  partner.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    partner.userName || "User"
                  )}`
                }
                className="w-10 h-10 rounded-full border border-border object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {partner.userName}
                </p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>

            <ChatWindow
              user={user}
              receiver={partner}
              conversationId={activeConversation._id}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select a conversation to start messaging.
          </div>
        )}
      </div>

      {/* MOBILE CHAT OVERLAY */}
      {isMobile && activeConversation && partner && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-background z-50 flex flex-col">

          {/* Mobile Header */}
          <div className="px-4 py-3 border-b border-border bg-card/90 backdrop-blur-sm flex items-center gap-3">
            <button
              onClick={() => setActiveConversation(null)}
              className="p-2 rounded-full hover:bg-muted/40"
            >
              <ArrowLeft size={20} />
            </button>

            <img
              src={
                partner.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  partner.userName || "User"
                )}`
              }
              className="w-10 h-10 rounded-full border border-border object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{partner.userName}</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          <ChatWindow
            user={user}
            receiver={partner}
            conversationId={activeConversation._id}
          />
        </div>
      )}
    </div>
  );
}
