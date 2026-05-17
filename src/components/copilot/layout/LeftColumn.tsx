import { SectionBox } from './SectionBox'
import { ActionsPanel } from '../actions/ActionsPanel'
import { MapPanel } from '../actions/MapPanel'
import { ResultsList } from '../actions/ResultsList'
import type { Property } from '../../../types/copilot'

interface Props {
  properties: Property[]
  onAction: (label: string) => void
  disabled?: boolean
}

export function LeftColumn({ properties, onAction, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-72 md:flex-shrink-0 md:pr-4">
      <SectionBox label="Actions">
        <ActionsPanel onAction={onAction} disabled={disabled} />
      </SectionBox>
      <SectionBox label="Map View · Eastern Suburbs">
        <MapPanel />
      </SectionBox>
      <SectionBox label={`Results · ${properties.length} Properties Found`}>
        <div className="max-h-[380px] overflow-y-auto pr-1">
          <ResultsList properties={properties} />
        </div>
      </SectionBox>
    </div>
  )
}
