import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getConversations, createConversation } from "@/utils/chatApi";
import { setConversations } from "@/features/chat/chatSlice";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { socket } from "@/socket/socket";
import { newMessageAlert } from "@/features/chat/chatSlice";

export default function InboxPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const conversations = useSelector((s) => s.chat.conversations);

  const [activeConversation, setActiveConversation] = useState(null);
  const [searchParams] = useSearchParams();

  // OPTIONAL: if /inbox?with=<userId> open/create chat with that user
  const fromUserId = searchParams.get("with");

  useEffect(() => {
    socket.on("new-message-alert", (payload) => {
      dispatch(newMessageAlert(payload));
    });

    return () => {
      socket.off("new-message-alert");
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    getConversations(user._id).then((res) =>
      dispatch(setConversations(res.data.data))
    );
  }, [user, dispatch]);

  // If ?with=userId provided, create/get conversation once conversations loaded
  useEffect(() => {
    if (!user || !fromUserId) return;

    (async () => {
      const res = await createConversation({
        senderId: user._id,
        receiverId: fromUserId,
      });

      const convo = res.data.data;

      // ensure it's in redux list (simple merge)
      const exists = conversations.find((c) => c._id === convo._id);
      if (!exists) {
        dispatch(setConversations([convo, ...conversations]));
      }

      setActiveConversation(convo);
    })();
  }, [fromUserId, user]); // eslint-disable-line

  // For simple devices we detect width with CSS: mobile shows one panel at a time
  const isMobile = window.innerWidth < 768;

  const handleSelectConversation = (c) => {
    setActiveConversation(c);
  };

  const partner =
    activeConversation &&
    activeConversation.participants.find(
      (p) => String(p._id) !== String(user?._id)
    );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background scrollbar-hide">
        <p className="text-sm text-muted-foreground">
          Please login to view your inbox.
        </p>
      </div>
    );
  }

  return (
   <div className="h-[calc(100vh-64px)] w-full overflow-hidden flex bg-background">
      {/* LEFT PANEL — conversation list */}
      <div className="w-full md:w-[350px] flex flex-col border-r border-border overflow-hidden">
        {/* FIXED HEADER */}
        <div className="px-4 py-3 border-b border-border bg-card shrink-0">
          <h1 className="text-lg font-semibold">Chats</h1>
        </div>

        {/* SCROLLABLE LIST ONLY */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent ">
          <ConversationList
            conversations={conversations}
            currentUserId={user._id}
            activeConversationId={activeConversation?._id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>

      {/* RIGHT PANEL — desktop only */}
      <div className="hidden md:flex flex-1 flex-col overflow-hidden">
        {activeConversation && partner ? (
          <>
            {/* FIXED CHAT HEADER */}
            <div className="px-4 py-3 border-b border-border bg-card shrink-0 flex items-center gap-3">
              <img
                src={
                  partner.avatar ||
                  `https://ui-avatars.com/api/?name=${partner.userName}`
                }
                className="w-10 h-10 rounded-full border border-border object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{partner.userName}</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>

            {/* CHAT CONTENT SCROLLABLE */}
            <div className="flex-1 overflow-y-auto">
              <ChatWindow
                user={user}
                receiver={partner}
                conversationId={activeConversation._id}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* MOBILE CHAT OVERLAY */}
      {isMobile && activeConversation && partner && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col overflow-hidden md:hidden">
          {/* FIXED HEADER MOBILE */}
          <div className="px-4 py-3 border-b border-border bg-card shrink-0 flex items-center gap-3">
            <button onClick={() => setActiveConversation(null)}>
              <ArrowLeft size={18} />
            </button>
            <img
              src={
                partner.avatar ||
                `https://ui-avatars.com/api/?name=${partner.userName}`
              }
              className="w-9 h-9 rounded-full border border-border object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{partner.userName}</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          {/* CHAT WINDOW WITH OWN SCROLL */}
          <div className="flex-1 overflow-y-auto">
            <ChatWindow
              user={user}
              receiver={partner}
              conversationId={activeConversation._id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
