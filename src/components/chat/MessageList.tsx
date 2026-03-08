import { useEffect, useRef } from "react";
import type { Message } from "../../types/chat";

interface Props {
  messages: Message[];
  isLoading: boolean;
  error?: string | null;
}

export const MessageList = ({ messages, isLoading, error }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
          <span className="text-3xl mb-2">💬</span>
          <p>Ask anything about real estate</p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm text-sm text-gray-500 flex items-center gap-2">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
            AI is thinking...
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed bg-red-50 border border-red-200 text-red-600 rounded-bl-sm">
            {error}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
