export const TypingIndicator = () => (
  <div className="flex gap-3 items-start">
    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shrink-0 text-white text-[10px] font-bold select-none">
      AI
    </div>
    <div className="flex items-center gap-1 pt-2.5">
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);
