import { useState, useCallback, useRef } from 'react';
import { streamChatMessage } from '../api/chatApi';
import { detectPanelData } from '../utils/chatPanelUtils';
import { extractErrorMessage } from '../utils/errorUtils';
import type { Message, ChatRequest, RightPanelData } from '../types/chat';

interface UseAssistantChatReturn {
  messages: Message[];
  isPending: boolean;
  toolStatus: string | null;
  error: string | null;
  rightPanelData: RightPanelData | null;
  sendMessage: (content: string) => Promise<void>;
  dismissRightPanel: () => void;
  startNewChat: () => void;
}

export function useAssistantChatStream(): UseAssistantChatReturn {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [rightPanelData, setRightPanelData] = useState<RightPanelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      setMessages((prev) => [...prev, { role: 'user', content }]);
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      setIsPending(true);

      abortRef.current = new AbortController();
      const payload: ChatRequest = { message: content, propertyId: null, threadId };

      try {
        await streamChatMessage(
          payload,
          (event) => {
            switch (event.type) {
              case 'token':
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  return [...prev.slice(0, -1), { ...last, content: last.content + event.content }];
                });
                break;

              case 'tool_start':
                setToolStatus(event.tool);
                break;

              case 'tool_end':
                setToolStatus(null);
                break;

              case 'result':
                if (event.thread_id) setThreadId(event.thread_id);
                if (event.listings?.length) {
                  setRightPanelData({
                    type: 'properties',
                    title: 'Properties Found',
                    properties: event.listings.map((l) => ({
                      propertyId: l.property_id,
                      listingId: l.listing_id,
                      propertyUrl: l.property_url,
                    })),
                  });
                }
                break;

              case 'error':
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  return last.role === 'assistant' && last.content === ''
                    ? prev.slice(0, -1)
                    : prev;
                });
                setError(event.message);
                break;

              case 'done':
                setRightPanelData((current) => current ?? detectPanelData(content));
                break;
            }
          },
          abortRef.current.signal,
        );
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return last.role === 'assistant' && last.content === ''
            ? prev.slice(0, -1)
            : prev;
        });
        setError(extractErrorMessage(err, 'Failed to get a response. Please try again.'));
      } finally {
        setIsPending(false);
        setToolStatus(null);
        abortRef.current = null;
      }
    },
    [threadId],
  );

  const dismissRightPanel = useCallback(() => setRightPanelData(null), []);

  const startNewChat = useCallback(() => {
    abortRef.current?.abort();
    setThreadId(null);
    setMessages([]);
    setRightPanelData(null);
    setError(null);
    setIsPending(false);
    setToolStatus(null);
  }, []);

  return {
    messages,
    isPending,
    toolStatus,
    error,
    rightPanelData,
    sendMessage,
    dismissRightPanel,
    startNewChat,
  };
}
