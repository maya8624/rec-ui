import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
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
  const [threadId, setThreadId] = useState<string | null>(
    () => sessionStorage.getItem('chat_threadId')
  );
  const [messages, setMessages] = useState<Message[]>(
    () => JSON.parse(sessionStorage.getItem('chat_messages') ?? '[]')
  );
  const [rightPanelData, setRightPanelData] = useState<RightPanelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  useEffect(() => {
    if (threadId) sessionStorage.setItem('chat_threadId', threadId);
    else sessionStorage.removeItem('chat_threadId');
  }, [threadId]);

  useEffect(() => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const abortRef = useRef<AbortController | null>(null);
  const tokenQueueRef = useRef<string[]>([]);
  const renderingRef = useRef(false);
  // Holds the user message when 'done' fires so panel detection runs after queue empties
  const pendingPanelContentRef = useRef<string | null>(null);

  const drain = useCallback(() => {
    renderingRef.current = true;
    const tick = () => {
      const tokens = tokenQueueRef.current.splice(0);
      if (tokens.length > 0) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: last.content + tokens.join('') }];
        });
        requestAnimationFrame(tick);
        return;
      }
      // Queue empty — trigger panel detection if stream is done
      renderingRef.current = false;
      if (pendingPanelContentRef.current !== null) {
        const msg = pendingPanelContentRef.current;
        pendingPanelContentRef.current = null;
        setRightPanelData((current) => current ?? detectPanelData(msg));
      }
    };
    requestAnimationFrame(tick);
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
                if (event.listings.length > 0) {
                  setRightPanelData({
                    type: 'listing-results',
                    title: `${event.listings.length} ${event.listings.length === 1 ? 'Property' : 'Properties'} Found`,
                    listings: event.listings,
                  });
                }
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
        if (axios.isCancel(err)) return;
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
    sessionStorage.removeItem('chat_threadId');
    sessionStorage.removeItem('chat_messages');
  }, [resetQueue]);

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
