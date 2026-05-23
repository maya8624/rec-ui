import type { ListingItem } from '../../../types/copilot'

interface Props {
  properties: ListingItem[]
}

export function MatchedListings({ properties }: Props) {
  if (properties.length === 0) {
    return (
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
        Click <span className="font-medium text-slate-500 dark:text-slate-400">Find matching properties</span> to see your matches.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {properties.map((p) => (
        <div
          key={p.listingId}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden"
        >
          <div className="w-full h-24 overflow-hidden bg-slate-100 dark:bg-slate-700">
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.address}
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

          <div className="px-2.5 py-2">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
              {p.address}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              {p.suburb}, {p.state} · {p.bedrooms}bd {p.bathrooms}ba
              {p.carSpaces > 0 ? ` · ${p.carSpaces} car` : ''}
            </p>

            <div className="flex items-center justify-between mt-1.5 gap-1">
              <span className="text-xs font-semibold text-gold shrink-0">
                ${p.price}/wk
              </span>
              <div className="flex items-center gap-1">
                {p.petFriendly && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 leading-tight">
                    Pets OK
                  </span>
                )}
                {p.propertyType && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-500 dark:text-slate-400 leading-tight">
                    {p.propertyType}
                  </span>
                )}
              </div>
            </div>

            {p.agencyName && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 truncate">
                {p.agencyName}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
