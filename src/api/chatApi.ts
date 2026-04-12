import { api } from "../services/apiClient";
import { chatRequestSchema } from "../types/chat";
import type { ChatRequest, ChatResponse } from "../types/chat";

export const sendChatmessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  chatRequestSchema.parse(payload);
  const res = await api.post("/ai/chat", payload);
  return res.data;
};

export const getHistory = async (sessionId: string) => {
  const res = await api.get(`/ai/history?sessionId=${sessionId}`);
  return res.data; // array of { role, message, timestamp }
};
