import ConversationItem from "./ConversationItem";

export default function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  onSelectConversation,
}) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        No conversations yet.
      </div>
    );
  }

  return (
    <div
  className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500"
>

      {conversations.map((c) => (
        <ConversationItem
          key={c._id}
          conversation={c}
          currentUserId={currentUserId}
          isActive={String(c._id) === String(activeConversationId)}
          onClick={() => onSelectConversation(c)}
        />
      ))}
    </div>
  );
}
