import { FilterBar } from '../grid/FilterBar'
import { PropertyCard } from '../grid/PropertyCard'
import type { Property } from '../../../types/copilot'

interface Props {
  properties: Property[]
  onBook: (address: string) => void
}

export function MainGrid({ properties, onBook }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      <FilterBar />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {properties.map(p => (
            <PropertyCard key={p.id} property={p} onBook={onBook} />
          ))}
        </div>
      </div>
    </div>
  )
}
