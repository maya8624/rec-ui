import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import type { Message } from '../../types/chat';

interface Props {
  message: Message;
  isStreaming?: boolean;
}

const AssistantAvatar = () => (
  <div className="w-7 h-7 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center shrink-0 text-white text-[10px] font-bold select-none mt-0.5">
    H
  </div>
);

function AssistantMessage({ message, isStreaming }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [message.content]);

  return (
    <div className="flex gap-3 items-start group">
      <AssistantAvatar />
      <div className="flex-1 min-w-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200 pt-0.5">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-2 mb-2">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
            li: ({ children }) => <li className="leading-snug">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            blockquote: ({ children }) => (
              <blockquote className="my-2 pl-3 border-l-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 italic">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="my-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm border-collapse">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50 dark:bg-gray-800/60">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{children}</td>
            ),
            pre: ({ children }) => (
              <div className="my-3 rounded-lg bg-gray-900 dark:bg-black overflow-hidden">
                <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-100 leading-relaxed">
                  {children}
                </pre>
              </div>
            ),
            code: ({ className, children }) => {
              if (className) {
                return <code className={className}>{children}</code>;
              }
              return (
                <code className="bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 rounded px-1.5 py-0.5 text-[0.875em] font-mono">
                  {children}
                </code>
              );
            },
            a: ({ href, children }) => {
              const text = Array.isArray(children) ? children.join('') : String(children ?? '')
              if (text === href) return null
              return <span className="font-medium text-gray-800 dark:text-gray-200">{children}</span>
            },
          }}
        >
          {message.content}
        </ReactMarkdown>

        {isStreaming && (
          <span
            aria-hidden
            className="inline-block w-0.5 h-[1.1em] bg-gray-400 dark:bg-gray-500 ml-0.5 align-text-bottom animate-pulse"
          />
        )}

        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy message'}
          className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none cursor-pointer p-0"
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="text-[11px]" />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}

export const MessageItem = ({ message, isStreaming }: Props) => {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  return <AssistantMessage message={message} isStreaming={isStreaming} />;
};
