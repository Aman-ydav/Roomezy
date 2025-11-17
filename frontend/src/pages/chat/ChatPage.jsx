import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { createConversation } from "@/utils/chatApi";

export default function ChatPage() {
  const { id: receiverId } = useParams();
  const user = useSelector((state) => state.auth.user);

  const [conversationId, setConversationId] = useState(null);
  const [receiver, setReceiver] = useState(null);

  // STEP 1 → create or get conversation
  useEffect(() => {
    async function loadConversation() {
      const res = await createConversation({
        senderId: user._id,
        receiverId,
      });

      const convo = res.data.data;
      setConversationId(convo._id);

      // look up receiver data from participants
      const partnerId = convo.participants.find((p) => p !== user._id);
      setReceiver({ _id: partnerId });
    }

    loadConversation();
  }, [receiverId]);

  if (!conversationId) return <div>Loading...</div>;

  return (
    <div className="h-screen bg-gray-50">
      <ChatWindow
        user={user}
        receiver={receiver}
        conversationId={conversationId}
      />
    </div>
  );
}
