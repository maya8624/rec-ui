// Later we can:
// Add optimistic updates
// Retry logic
// Error boundaries

import { useMutation } from "@tanstack/react-query";
import { sendChatmessage } from '../api/copilotApi';
import type { CopilotRequest } from "../types/copilot";


export const useChat = () => {
  return (
    useMutation({
        mutationFn: (payload: CopilotRequest) => sendChatmessage(payload),
    })
  )
}

