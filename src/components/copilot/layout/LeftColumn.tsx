import { SectionBox } from './SectionBox'
import { ActionsPanel } from '../actions/ActionsPanel'
import { SuggestedSteps } from '../chat/SuggestedSteps'
import { WorkflowTrace } from '../chat/WorkflowTrace'
import type { WorkflowStep } from '../../../types/copilot'

interface Props {
  onAction: (label: string) => void
  disabled?: boolean
  steps: WorkflowStep[]
  suggestedSteps: string[]
}

export function LeftColumn({ onAction, disabled, steps, suggestedSteps }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-72 md:flex-shrink-0 md:pr-4 md:h-[calc(100vh-120px)] md:overflow-y-auto md:sticky md:top-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <SectionBox label="Actions">
        <ActionsPanel onAction={onAction} disabled={disabled} />
      </SectionBox>
      <SectionBox label="Suggested Next Steps">
        <SuggestedSteps steps={suggestedSteps} onAction={onAction} disabled={disabled} />
      </SectionBox>
      <SectionBox label="Workflow · Last Run">
        <WorkflowTrace steps={steps} />
      </SectionBox>
      {/* <SectionBox label="Map View · Eastern Suburbs">
        <MapPanel />
      </SectionBox> */}
    </div>
  )
}
