import { useState } from "react";
import type { Message } from "../../types/chat";
import { useChat } from "../../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

interface Props {
  onClose?: () => void;
  propertyId?: number | null;
}

export const ChatLayout = ({ onClose, propertyId = null }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { mutateAsync, isPending } = useChat();

  const handleSend = async (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content }]);

    const response = await mutateAsync({
      Message: content,
      PropertyId: propertyId,
      SessionId: sessionId,
    });

    if (response.sessionId) {
      setSessionId(response.sessionId);
    }

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: response.answer },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-4 py-4 border-b bg-white flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            AI Real Estate Assistant
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Helping Buyers, Sellers & Agents
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <MessageList messages={messages} isLoading={isPending} />

      <div className="shrink-0">
        <ChatInput onSend={handleSend} disabled={isPending} />
      </div>
    </div>
  );
};
