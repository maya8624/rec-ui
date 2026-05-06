import { useState, useCallback, useRef } from 'react';
import { streamChatMessage, HttpError } from '../api/chatApi';
import { detectPanelData } from '../utils/chatPanelUtils';
import { extractErrorMessage } from '../utils/errorUtils';
import type { Message, ChatRequest, RightPanelData } from '../types/chat';

const TOKEN_RENDER_DELAY_MS = 20;

interface UseAssistantChatReturn {
  messages: Message[];
  isPending: boolean;
  toolStatus: string | null;
  error: string | null;
  rightPanelData: RightPanelData | null;
  sendMessage: (content: string) => Promise<void>;
  showPropertyPanel: (propertyId: string, href: string, label: string) => void;
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
  const tokenQueueRef = useRef<string[]>([]);
  const renderingRef = useRef(false);
  // Holds the user message when 'done' fires so panel detection runs after queue empties
  const pendingPanelContentRef = useRef<string | null>(null);

  const drain = useCallback(() => {
    renderingRef.current = true;
    const interval = window.setInterval(() => {
      const token = tokenQueueRef.current.shift();
      if (token !== undefined) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: last.content + token }];
        });
        return;
      }
      // Queue empty — stop and trigger panel detection if stream is done
      renderingRef.current = false;
      clearInterval(interval);
      if (pendingPanelContentRef.current !== null) {
        const msg = pendingPanelContentRef.current;
        pendingPanelContentRef.current = null;
        setRightPanelData((current) => current ?? detectPanelData(msg));
      }
    }, TOKEN_RENDER_DELAY_MS);
  }, []);

  const enqueue = useCallback((token: string) => {
    tokenQueueRef.current.push(token);
    if (!renderingRef.current) drain();
  }, [drain]);

  const resetQueue = useCallback(() => {
    tokenQueueRef.current = [];
    renderingRef.current = false;
    pendingPanelContentRef.current = null;
  }, []);

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
                enqueue(event.content);
                break;

              case 'tool_start':
                setToolStatus(event.tool);
                break;

              case 'tool_end':
                setToolStatus(null);
                break;

              case 'result':
                if (event.thread_id) setThreadId(event.thread_id);
                break;

              case 'error':
                resetQueue();
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  return last.role === 'assistant' && last.content === ''
                    ? prev.slice(0, -1)
                    : prev;
                });
                setError(event.message);
                break;

              case 'done':
                // Let the queue drain naturally; panel detection fires when queue empties
                if (tokenQueueRef.current.length === 0) {
                  setRightPanelData((current) => current ?? detectPanelData(content));
                } else {
                  pendingPanelContentRef.current = content;
                }
                break;
            }
          },
          abortRef.current.signal,
        );
      } catch (err) {
        resetQueue();
        if ((err as Error).name === 'AbortError') return;
        if (err instanceof HttpError && err.status === 401) {
          window.location.href = '/login';
          return;
        }
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
    [threadId, enqueue, resetQueue],
  );

  const showPropertyPanel = useCallback((propertyId: string, href: string, label: string) => {
    setRightPanelData({
      type: 'properties',
      title: label,
      properties: [{ propertyId, listingId: propertyId, propertyUrl: href }],
    });
  }, []);

  const dismissRightPanel = useCallback(() => setRightPanelData(null), []);

  const startNewChat = useCallback(() => {
    abortRef.current?.abort();
    resetQueue();
    setThreadId(null);
    setMessages([]);
    setRightPanelData(null);
    setError(null);
    setIsPending(false);
    setToolStatus(null);
  }, [resetQueue]);

  return {
    messages,
    isPending,
    toolStatus,
    error,
    rightPanelData,
    sendMessage,
    showPropertyPanel,
    dismissRightPanel,
    startNewChat,
  };
}
