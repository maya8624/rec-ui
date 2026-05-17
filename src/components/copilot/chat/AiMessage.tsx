import type { CopilotMessage } from '../../../types/copilot'

export function AiMessage({ message }: { message: CopilotMessage }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gold">rec-brain</span>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {message.text}
        {message.streaming && (
          <span
            aria-hidden
            className="inline-block w-0.5 h-[1em] bg-gold animate-pulse ml-0.5 align-text-bottom"
          />
        )}
      </p>
    </div>
  )
}
