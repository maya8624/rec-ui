import { useEffect, useRef } from 'react';
import type { Message } from '../../types/chat';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
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
      <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-sm">
        {SUGGESTIONS.map((s) => (
          <SuggestionChip key={s} label={s} />
        ))}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  'Show me apartments in Bondi',
  'How does stamp duty work?',
  'Find houses under $1.5M',
  'What is the buying process?',
];

function SuggestionChip({ label }: { label: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-400 text-left cursor-default select-none">
      {label}
    </div>
  );
}

export const MessageList = ({ messages, isLoading, error }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      {isEmpty ? (
        <div className="h-full flex items-center justify-center">
          <EmptyState />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {messages.map((msg, i) => (
            <MessageItem key={i} message={msg} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400/70 text-center py-2">{error}</p>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
