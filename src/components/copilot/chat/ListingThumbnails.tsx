import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBed, faBath, faCar, faPaw } from '@fortawesome/free-solid-svg-icons'
import type { ListingItem } from '../../../types/copilot'

interface Props {
  listings: ListingItem[]
}

export function ListingThumbnails({ listings }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {listings.map((p) => (
        <a
          key={p.listingId}
          href={`/property/${p.propertyId}`}
          target="property-detail"
          className="block no-underline bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all"
        >
          <div className="relative h-28 overflow-hidden bg-gray-100 dark:bg-gray-700">
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.address}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                No image
              </div>
            )}
            {p.propertyType && (
              <span className="absolute top-2 left-2 text-[10px] font-semibold bg-gray-900/60 text-white px-1.5 py-0.5 rounded">
                {p.propertyType}
              </span>
            )}
            {p.petFriendly && (
              <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold bg-emerald-600/80 text-white px-1.5 py-0.5 rounded">
                <FontAwesomeIcon icon={faPaw} className="text-[9px]" />
                Pets OK
              </span>
            )}
          </div>

          <div className="p-2.5">
            <p className="font-bold text-sm text-gold mb-0.5">
              ${p.price.toLocaleString()}/wk
            </p>
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate leading-snug">
              {p.address}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              {p.suburb}, {p.state} {p.postcode}
            </p>

            <div className="flex items-center gap-2.5 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              {p.bedrooms > 0 && (
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faBed} />
                  {p.bedrooms}
                </span>
              )}
              {p.bathrooms > 0 && (
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faBath} />
                  {p.bathrooms}
                </span>
              )}
              {p.carSpaces > 0 && (
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCar} />
                  {p.carSpaces}
                </span>
              )}
            </div>

            {p.agencyName && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 truncate">
                {p.agencyName}{p.agentName ? ` · ${p.agentName}` : ''}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
