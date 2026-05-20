import { Building2 } from 'lucide-react'
import type { CopilotMessage } from '../../../types/copilot'
import { SuburbSummaryMessage } from './SuburbSummaryMessage'

export function AiMessage({ message }: { message: CopilotMessage }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-lg bg-gold flex items-center justify-center flex-shrink-0 mt-0.5">
        <Building2 className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1">
        {message.type === 'suburb-summary' && message.suburbSummary ? (
          <SuburbSummaryMessage data={message.suburbSummary} />
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {message.text}
            {message.streaming && (
              <span
                aria-hidden
                className="inline-block w-0.5 h-[1em] bg-gold animate-pulse ml-0.5 align-text-bottom"
              />
            )}
          </p>
        )}
      </div>
    </div>
  )
}
