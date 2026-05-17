import type { WorkflowStep } from '../../../types/copilot'

interface Props {
  steps: WorkflowStep[]
}

export function WorkflowTrace({ steps }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-2">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
              step.status === 'done'
                ? 'bg-green-400'
                : step.status === 'pending'
                ? 'bg-amber-400'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-xs text-slate-300 leading-snug">
            {step.label}
            {step.detail && (
              <span className="text-slate-500"> · {step.detail}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}
