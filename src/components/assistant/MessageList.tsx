import { useEffect, useRef } from "react";
import type { Message } from "../../types/chat";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

const TOOL_LABELS: Record<string, string> = {
  search_properties: "Searching properties",
  get_property: "Looking up property",
};

function ToolStatusIndicator({ tool }: { tool: string }) {
  const label = TOOL_LABELS[tool] ?? "Working";
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-zinc-700 dark:bg-[#292524] flex items-center justify-center shrink-0 text-white text-[10px] font-bold select-none">
        H
      </div>
      <div className="flex items-center gap-2 pt-2.5 text-sm text-gray-500 dark:text-gray-400">
        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
        <span className="ml-1">{label}...</span>
      </div>
    </div>
  );
}

interface Props {
  messages: Message[];
  isLoading: boolean;
  toolStatus?: string;
  error: string | null;
  onLinkClick?: (propertyId: string, href: string, label: string) => void;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
      <div className="w-14 h-14 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center text-white font-bold text-lg select-none">
        H
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
          Real Estate Assistant
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          Ask me to find properties, explain the buying process, estimate stamp
          duty, or anything else real estate.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2 w-full max-w-sm">
        {SUGGESTIONS.map((s) => (
          <SuggestionChip key={s} label={s} />
        ))}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Show me apartments in Sydney",
  "Find houses under $2.5M in Parramatta",
  "What are the agency details?",
];

function SuggestionChip({ label }: { label: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-400 text-left cursor-default select-none">
      {label}
    </div>
  );
}

export const MessageList = ({
  messages,
  isLoading,
  toolStatus,
  error,
  onLinkClick,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, toolStatus]);

  // Filter out the empty assistant placeholder — the tool/typing indicator covers it
  const visibleMessages = messages.filter(
    (msg) => msg.role !== "assistant" || msg.content.length > 0,
  );

  const isEmpty = visibleMessages.length === 0 && !isLoading;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      {isEmpty ? (
        <div className="h-full flex items-center justify-center">
          <EmptyState />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {visibleMessages.map((msg, i) => (
            <MessageItem key={i} message={msg} onLinkClick={onLinkClick} />
          ))}

          {toolStatus && <ToolStatusIndicator tool={toolStatus} />}
          {isLoading && !toolStatus && <TypingIndicator />}

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400/70 text-center py-2">
              {error}
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
