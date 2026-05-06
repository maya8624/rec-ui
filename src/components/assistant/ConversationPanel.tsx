import type { Message } from '../../types/chat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface Props {
  messages: Message[];
  isLoading: boolean;
  toolStatus?: string;
  error: string | null;
  onSend: (message: string) => void;
  onLinkClick?: (propertyId: string, href: string, label: string) => void;
}

export const ConversationPanel = ({ messages, isLoading, toolStatus, error, onSend, onLinkClick }: Props) => (
  <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-[#1C1917]">
    <MessageList messages={messages} isLoading={isLoading} toolStatus={toolStatus} error={error} onLinkClick={onLinkClick} />
    <ChatInput onSend={onSend} disabled={isLoading} />
  </div>
);
