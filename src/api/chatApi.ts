import { api } from "../services/apiClient";
import { copilotRequestSchema } from "../types/chat";
import type { CopilotRequest, ChatResponse, ListingResult } from "../types/chat";

export const sendChatmessage = async (payload: CopilotRequest): Promise<ChatResponse> => {
  copilotRequestSchema.parse(payload);
  const res = await api.post("/ai/copilot", payload);
  return res.data;
};

export type StreamListing = ListingResult

export type StreamSuburbProfile = {
  name: string
  description: string
  rents: { one_bedroom: string | null; two_bedroom: string | null; three_bedroom: string | null }
  vacancy_rate: string | null
  trend: string | null
}

export type StreamSuburbSummary = {
  suburbs: StreamSuburbProfile[]
}

export type StreamEvent =
  | { type: 'token'; content: string }
  | { type: 'tool_start'; tool: string }
  | { type: 'tool_end'; tool: string }
  | { type: 'result'; thread_id: string | null; listings: StreamListing[]; property_id: string | null; suburb_summary: StreamSuburbSummary | null }
  | { type: 'error'; message: string }
  | { type: 'done' };

export const streamChatMessage = async (
  payload: CopilotRequest,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> => {
  copilotRequestSchema.parse(payload);

  let processedLength = 0;
  let buffer = '';

  await api.post('/ai/copilot/stream', payload, {
    responseType: 'text',
    onDownloadProgress: (progressEvent) => {
      const xhr = progressEvent.event.target as XMLHttpRequest;
      const newData = xhr.responseText.slice(processedLength);
      processedLength = xhr.responseText.length;

      buffer += newData;
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith('data:')) continue;
        const jsonStr = line.slice('data:'.length).trim();
        if (!jsonStr) continue;
        if (jsonStr === '[DONE]') {
          onEvent({ type: 'done' });
          continue;
        }
        onEvent(JSON.parse(jsonStr) as StreamEvent);
      }
    },
    signal,
  });
};

export const getHistory = async (sessionId: string) => {
  const res = await api.get(`/ai/history?sessionId=${sessionId}`);
  return res.data;
};
