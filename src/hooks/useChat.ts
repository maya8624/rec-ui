// Later we can:
// Add optimistic updates
// Retry logic
// Error boundaries

import { useMutation } from "@tanstack/react-query";
import { sendChatmessage } from "../api/chatApi";
import type { CopilotRequest } from "../types/chat";


export const useChat = () => {
  return (
    useMutation({
        mutationFn: (payload: CopilotRequest) => sendChatmessage(payload),
    })
  )
}
