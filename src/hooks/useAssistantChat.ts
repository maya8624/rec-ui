import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendChatmessage } from '../api/chatApi';
import { detectPanelData } from '../utils/chatPanelUtils';
import { extractErrorMessage } from '../utils/errorUtils';
import { useThreadId } from './useThreadId';
import type { Message, ChatRequest, RightPanelData } from '../types/chat';

interface UseAssistantChatReturn {
  messages: Message[];
  isPending: boolean;
  error: string | null;
  rightPanelData: RightPanelData | null;
  sendMessage: (content: string) => Promise<void>;
  dismissRightPanel: () => void;
  startNewChat: () => void;
}

export function useAssistantChat(): UseAssistantChatReturn {
  const { threadId, setThreadId, resetThread } = useThreadId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [rightPanelData, setRightPanelData] = useState<RightPanelData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ChatRequest) => sendChatmessage(payload),
  });

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      setMessages((prev) => [...prev, { role: 'user', content }]);

      try {
        const response = await mutateAsync({
          message: content,
          propertyId: null,
          threadId,
        });

        if (response.threadId) {
          setThreadId(response.threadId);
        }

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.reply },
        ]);

        // Backend panelData takes precedence; fall back to client-side detection
        const panel = response.panelData ?? detectPanelData(content);
        if (panel) {
          setRightPanelData(panel);
        }
      } catch (err) {
        setError(extractErrorMessage(err, 'Failed to get a response. Please try again.'));
      }
    },
    [mutateAsync, threadId, setThreadId],
  );

  const dismissRightPanel = useCallback(() => setRightPanelData(null), []);

  const startNewChat = useCallback(() => {
    resetThread();
    setMessages([]);
    setRightPanelData(null);
    setError(null);
  }, [resetThread]);

  return {
    messages,
    isPending,
    error,
    rightPanelData,
    sendMessage,
    dismissRightPanel,
    startNewChat,
  };
}
