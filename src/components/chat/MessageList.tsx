import type { Message } from "../../types/chat";

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: Props) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
      {messages.length === 0 && (
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
            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
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
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm text-sm text-gray-500">
            AI is analysing...
          </div>
        </div>
      )}
    </div>
  );
};
