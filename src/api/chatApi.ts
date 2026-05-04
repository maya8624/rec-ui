import { api } from "../services/apiClient";
import { chatRequestSchema } from "../types/chat";
import type { ChatRequest, ChatResponse } from "../types/chat";
import { config } from "../config/config";

export class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message?: string) {
    super(message ?? `HTTP ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const sendChatmessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  chatRequestSchema.parse(payload);
  const res = await api.post("/ai/chat", payload);
  return res.data;
};

export type StreamEvent =
  | { type: 'token'; content: string }
  | { type: 'tool_start'; tool: string }
  | { type: 'tool_end'; tool: string }
  | { type: 'result'; thread_id: string | null; listings: Array<{ property_id: string; listing_id: string; property_url: string }>; property_id: string | null }
  | { type: 'error'; message: string }
  | { type: 'done' };

export const streamChatMessage = async (
  payload: ChatRequest,
  onEvent: (event: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> => {
  chatRequestSchema.parse(payload);

  const baseUrl = config.apiBaseUrl || '/api';
  const response = await fetch(`${baseUrl}/ai/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
    signal,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new HttpError(response.status, body?.message);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith('data:')) continue;
      const jsonStr = line.slice('data:'.length).trim();
      if (!jsonStr) continue;
      if (jsonStr === '[DONE]') {
        onEvent({ type: 'done' });
        continue;
      }
      onEvent(JSON.parse(jsonStr) as StreamEvent);
    }
  }
};

export const getHistory = async (sessionId: string) => {
  const res = await api.get(`/ai/history?sessionId=${sessionId}`);
  return res.data;
};
