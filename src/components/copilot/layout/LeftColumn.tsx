import { SectionBox } from './SectionBox'
import { ActionsPanel } from '../actions/ActionsPanel'
import { MapPanel } from '../actions/MapPanel'
import { MatchedListings } from '../actions/MatchedListings'
import type { ListingItem } from '../../../types/copilot'

interface Props {
  properties: ListingItem[]
  onAction: (label: string) => void
  disabled?: boolean
  listingsError?: boolean
}

export function LeftColumn({ properties, onAction, disabled, listingsError }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-72 md:flex-shrink-0 md:pr-4">
      <SectionBox label="Actions">
        <ActionsPanel onAction={onAction} disabled={disabled} />
      </SectionBox>
      <SectionBox label="Map View · Eastern Suburbs">
        <MapPanel />
      </SectionBox>
      <SectionBox label={`Matched Listings · ${properties.length} Found`}>
        {listingsError && (
          <p className="text-xs text-amber-500 mb-2">
            Something went wrong loading your matches.
          </p>
        )}
        <div className="max-h-[380px] overflow-y-auto pr-1">
          <MatchedListings properties={properties} />
        </div>
      </SectionBox>
    </div>
  )
}
