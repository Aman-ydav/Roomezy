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
import { useLocation } from "react-router-dom";

export default function InboxPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const conversations = useSelector((s) => s.chat.conversations);

  const [activeConversation, setActiveConversation] = useState(null);
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const openChatWith = location.state?.openChatWith;

  useEffect(() => {
    if (openChatWith && conversations.length > 0) {
      const targetConversation = conversations.find((c) =>
        c.participants.some((p) => String(p._id) === String(openChatWith))
      );

      if (targetConversation) {
        setActiveConversation(targetConversation);
      }
    }
  }, [openChatWith, conversations]);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Please login to view your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-hidden flex bg-background">
      {/* LEFT PANEL — conversation list */}
      <div className="w-full md:w-[350px] flex flex-col border-r border-border overflow-hidden bg-card shadow-sm">
        {/* FIXED HEADER */}
        <div className="px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm shrink-0">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
        </div>

        {/* SCROLLABLE LIST ONLY */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <ConversationList
            conversations={conversations}
            currentUserId={user._id}
            activeConversationId={activeConversation?._id}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>

      {/* RIGHT PANEL — desktop only */}
      <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-background">
        {activeConversation && partner ? (
          <>
            {/* FIXED CHAT HEADER */}
            <div className="px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm shrink-0 flex items-center gap-4 shadow-sm">
              <img
                src={
                  partner.avatar ||
                  `https://ui-avatars.com/api/?name=${partner.userName}`
                }
                className="w-11 h-11 rounded-full border border-border object-cover shadow-sm"
              />
              <div>
                <p className="text-base font-semibold text-foreground">{partner.userName}</p>
                <p className="text-xs text-green-600 font-medium">Online</p>
              </div>
            </div>

            {/* CHAT CONTENT SCROLLABLE */}
            <div className="flex-1 overflow-y-auto bg-background">
              <ChatWindow
                user={user}
                receiver={partner}
                conversationId={activeConversation._id}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground bg-muted/10">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* MOBILE CHAT OVERLAY */}
      {isMobile && activeConversation && partner && (
        <div className="fixed top-14 left-0 rigth-0 inset-0 z-10 bg-background flex flex-col overflow-hidden md:hidden shadow-lg">
          {/* FIXED HEADER MOBILE */}
          <div className="px-6 py-5 border-b border-border bg-card/95 backdrop-blur-sm shrink-0 flex items-center gap-4 shadow-sm">
            <button onClick={() => setActiveConversation(null)} className="p-1 rounded-full hover:bg-muted/20">
              <ArrowLeft size={20} className="text-foreground" />
            </button>
            <img
              src={
                partner.avatar ||
                `https://ui-avatars.com/api/?name=${partner.userName}`
              }
              className="w-10 h-10 rounded-full border border-border object-cover shadow-sm"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">{partner.userName}</p>
              <p className="text-xs text-green-600 font-medium">Online</p>
            </div>
          </div>

          {/* CHAT WINDOW WITH OWN SCROLL */}
          <div className="flex-1 overflow-y-auto bg-background">
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
