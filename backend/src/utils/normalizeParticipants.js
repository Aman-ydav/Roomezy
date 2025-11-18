export const normalizeParticipants = (participants) =>
  participants.map((p) =>
    typeof p === "string" ? { _id: p } : p
  );
