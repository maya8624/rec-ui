// Later we can:
// Add optimistic updates
// Retry logic
// Error boundaries

import { useMutation } from "@tanstack/react-query";
import { sendChatmessage } from "../api/chatApi";
import type { ChatRequest } from "../types/chat";


export const useChat = () => {
  return (
    useMutation({
        mutationFn: (payload: ChatRequest) => sendChatmessage(payload),
    })
  )
}
