import type { CopilotMessage } from '../../../types/copilot'

export function UserMessage({ message }: { message: CopilotMessage }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-3 py-2">
      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{message.text}</p>
    </div>
  )
}
