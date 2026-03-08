import {api} from "../services/apiClient";
import type { ChatRequest, ChatResponse } from "../types/chat";

export const sendChatmessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const res = await api.post("/chat/send-message", payload);

  // console.log("Chat API raw response:", data);

  // Handle common backend response shapes
  // const body = data.response ?? data;
 return res.data
};

export const getHistory = async (sessionId: string) => {
  const res = await api.get(`/chat/history?sessionId=${sessionId}`);
  return res.data; // array of { role, message, timestamp }
};
