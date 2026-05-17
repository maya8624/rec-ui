import type { AgentWorkflowStep } from '../../../types/agent'

function dotClass(status: AgentWorkflowStep['status']) {
  if (status === 'done') return 'bg-emerald-500'
  if (status === 'active') return 'bg-amber-400 animate-pulse'
  return 'bg-slate-300 dark:bg-slate-600'
}

export function WorkflowFooter({ steps }: { steps: AgentWorkflowStep[] }) {
  return (
    <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2 flex items-center overflow-x-auto">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass(step.status)}`} />
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{step.label}</span>
            {step.detail && (
              <span className="text-xs text-slate-400 dark:text-slate-600 whitespace-nowrap">&nbsp;{step.detail}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <span className="text-slate-300 dark:text-slate-600 text-xs">→</span>
          )}
        </div>
      ))}
    </div>
  )
}
