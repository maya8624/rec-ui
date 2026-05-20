import { Building2 } from 'lucide-react'

export function CopilotTypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-lg bg-gold flex items-center justify-center flex-shrink-0 mt-0.5">
        <Building2 className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex items-center gap-1 pt-1.5">
        <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}
