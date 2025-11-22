// src/features/chat/components/ChatWindow.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, MoreVertical, Phone, Video, Info } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import { useUserStatus } from "@/hooks/useUserStatus";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import { Button } from "@/components/ui/button";

export default function ChatWindow({ conversation, onBack, currentUser }) {
  const partner = conversation.participants.find(p => p._id !== currentUser._id);
  const messagesEndRef = useRef(null);
  const isPartnerOnline = useUserStatus(partner?._id);
  
  const {
    messages,
    typing,
    loading,
    sendMessage,
    sendTyping,
    stopTyping,
    markRead,
    getSenderId,
  } = useChat(conversation._id, currentUser, partner);

  // Mark as read when opening
  useEffect(() => {
    if (conversation._id && currentUser?._id) {
      markRead();
    }
  }, [conversation._id, currentUser?._id, markRead]);

  // Auto-scroll to bottom when new messages or typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSendMessage = (text) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
            <ChevronLeft size={20} />
          </Button>
          
          <div className="relative">
            <img
              src={partner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.userName || 'User')}&background=primary&color=fff`}
              alt={partner?.userName}
              className="w-10 h-10 rounded-full border border-border object-cover"
            />
            {isPartnerOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full"></div>
            )}
          </div>
          
          <div>
            <h2 className="font-semibold">{partner?.userName}</h2>
            <p className="text-xs text-muted-foreground">
              {isPartnerOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Video size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Info size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : (
          <>
            <MessageList 
              messages={messages} 
              currentUserId={currentUser._id}
              getSenderId={getSenderId}
              partner={partner}
            />
            
            {/* Typing Indicator */}
            <TypingIndicator 
              show={typing} 
              partnerName={partner?.userName} 
            />
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={sendTyping}
        onTypingStop={stopTyping}
        disabled={loading}
      />
    </div>
  );
}