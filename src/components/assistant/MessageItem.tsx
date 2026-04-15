import type { Message } from '../../types/chat';

interface Props {
  message: Message;
}

const AssistantAvatar = () => (
  <div className="w-7 h-7 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center shrink-0 text-white text-[10px] font-bold select-none mt-0.5">
    H
  </div>
);

export const MessageItem = ({ message }: Props) => {
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
      <p className="flex-1 text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap pt-0.5">
        {message.content}
      </p>
    </div>
  );
};
