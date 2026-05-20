import { CopilotFeed } from '../chat/CopilotFeed'
import { WorkflowTrace } from '../chat/WorkflowTrace'
import { SuggestedSteps } from '../chat/SuggestedSteps'
import { CopilotInput } from '../chat/CopilotInput'
import type { CopilotMessage, WorkflowStep } from '../../../types/copilot'

interface Props {
  messages: CopilotMessage[]
  steps: WorkflowStep[]
  suggestedSteps: string[]
  onAction: (label: string) => void
  onSend: (text: string, responseOverride?: string) => void
  isStreaming: boolean
  isWaiting?: boolean
}

export function CopilotPanel({ messages, steps, suggestedSteps, onAction, onSend, isStreaming, isWaiting }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full md:flex-1 md:sticky md:top-4 md:border-l md:border-slate-200 dark:md:border-slate-700 md:pl-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col h-[600px]">
        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-4 flex-shrink-0">
          Copilot
        </p>
        <CopilotFeed messages={messages} isWaiting={isWaiting} />
        <CopilotInput onSend={onSend} disabled={isStreaming} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Suggested Next Steps</p>
          <SuggestedSteps steps={suggestedSteps} onAction={onAction} disabled={isStreaming} />
        </div>
        <div className="bg-slate-800 dark:bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Workflow · Last Run</p>
          <WorkflowTrace steps={steps} />
        </div>
      </div>
    </div>
  )
}
