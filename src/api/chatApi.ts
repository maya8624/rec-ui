import {api} from "../services/apiClient";
import type { ChatRequest, ChatResponse } from "../types/chat";


// export const sendChatmessage = async(payload: ChatRequest
// ):Promise<ChatResponse> => {
//     const {data} = await api.post<ChatResponse>
//     (
//         "/chat", 
//         {message: payload}
//     );
    
//     return data;
// }

export const sendChatmessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const res = await api.post("/chat/send-message", payload);
  return res.data.response;
};

export const getHistory = async (sessionId: string) => {
  const res = await api.get(`/chat/history?sessionId=${sessionId}`);
  return res.data; // array of { role, message, timestamp }
};
