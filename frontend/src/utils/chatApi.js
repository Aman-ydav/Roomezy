import axios from "./axiosInterceptor";

// Create or Get Conversation
export const createConversation = (data) =>
  axios.post("/chat/conversation", data);

// Get user conversations
export const getConversations = (userId) =>
  axios.get(`/chat/conversations/${userId}`);

// Get messages
export const getMessages = (conversationId) =>
  axios.get(`/chat/messages/${conversationId}`);

// Send message API (DB save)
export const sendMessageApi = (data) =>
  axios.post("/chat/message", data);

// Mark messages as read
export const markAsRead = (conversationId, userId) =>
  axios.patch(`/chat/read/${conversationId}/${userId}`);
