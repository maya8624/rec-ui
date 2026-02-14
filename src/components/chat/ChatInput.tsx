import { useState } from "react";

interface Props {
  onSend: (value: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: Props) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue(""); // Clear input after sending
  };
  return (
    <div className="bg-white border-t px-4 py-3 flex items-center gap-2">
      <input
        className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about properties..."
        onKeyDown={(e) => e.key === "Enter" && !disabled && handleSend()}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
};
