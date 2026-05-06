import ReactMarkdown from 'react-markdown';
import type { Message } from '../../types/chat';

interface Props {
  message: Message;
  onLinkClick?: (propertyId: string, href: string, label: string) => void;
}

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  return '';
}

const AssistantAvatar = () => (
  <div className="w-7 h-7 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center shrink-0 text-white text-[10px] font-bold select-none mt-0.5">
    H
  </div>
);

export const MessageItem = ({ message, onLinkClick }: Props) => {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <AssistantAvatar />
      <div className="flex-1 min-w-0 text-sm leading-relaxed text-gray-800 dark:text-gray-200 pt-0.5">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-2 mb-2">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
            li: ({ children }) => <li className="leading-snug">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            a: ({ href, children }) => {
              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (!onLinkClick || !href) return;
                const match = href.match(UUID_RE);
                if (match) {
                  e.preventDefault();
                  onLinkClick(match[0], href, extractText(children));
                }
              };
              return (
                <a
                  href={href}
                  onClick={handleClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
