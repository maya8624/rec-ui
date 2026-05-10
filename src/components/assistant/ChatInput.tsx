import { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface Props {
  onSend: (value: string) => void;
  disabled?: boolean;
}

const MAX_TEXTAREA_HEIGHT = 160;

export const ChatInput = ({ onSend, disabled }: Props) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");

    // Reset height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-grow the textarea up to the max height
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1917] px-4 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-end gap-2 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-[#292524] focus-within:ring-2 focus-within:ring-zinc-400 focus-within:border-transparent transition-shadow">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about real estate..."
            disabled={disabled}
            maxLength={500}
            className="flex-1 resize-none bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none leading-6 py-0.5 disabled:opacity-50"
            style={{ minHeight: "48px", maxHeight: `${MAX_TEXTAREA_HEIGHT}px` }}
          />
          <button
            onClick={submit}
            disabled={!canSend}
            aria-label="Send message"
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-white dark:text-[#1C1917] dark:hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-none cursor-pointer"
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
