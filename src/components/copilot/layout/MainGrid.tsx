import { FilterBar } from '../grid/FilterBar'
import { PropertyCard } from '../grid/PropertyCard'
import type { ListingItem } from '../../../types/copilot'

interface Props {
  properties: ListingItem[]
  onBook: (address: string) => void
}

export function MainGrid({ properties, onBook }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      <FilterBar />
      <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {properties.map(p => (
            <PropertyCard key={p.listingId} property={p} onBook={onBook} />
          ))}
        </div>
      </div>
    </div>
  )
}
