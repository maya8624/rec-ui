import type { ListingItem } from '../../../types/copilot'

interface Props {
  properties: ListingItem[]
}

export function MatchedListings({ properties }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {properties.map((p) => (
        <div
          key={p.listingId}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden"
        >
          {/* Full-width image */}
          <div className="w-full h-24 overflow-hidden bg-slate-100 dark:bg-slate-700">
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.addressLine1}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs">
                No image
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="px-2.5 py-2">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
              {p.addressLine1}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              {p.suburb} · {p.bedrooms}bd {p.bathrooms}ba
              {p.buildingSizeSqm != null ? ` · ${p.buildingSizeSqm}m²` : ''}
            </p>

            {/* Price left, type tag right */}
            <div className="flex items-center justify-between mt-1.5 gap-1">
              <span className="text-xs font-semibold text-gold shrink-0">
                ${p.price}/wk
              </span>
              {p.propertyType && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-500 dark:text-slate-400 leading-tight">
                  {p.propertyType}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
