import type { Property } from '../../../types/copilot'

interface Props {
  properties: Property[]
}

export function ResultsList({ properties }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {properties.map((p) => (
        <div
          key={p.id}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden"
        >
          {/* Full-width image */}
          <div className="w-full h-24 overflow-hidden bg-slate-100 dark:bg-slate-700">
            <img
              src={p.image}
              alt={p.address}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>

          {/* Card body */}
          <div className="px-2.5 py-2">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">
              {p.address}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              {p.suburb} · {p.beds}bd {p.baths}ba · {p.sqm}m²
            </p>

            {/* Price left, tags right */}
            <div className="flex items-center justify-between mt-1.5 gap-1">
              <span className="text-xs font-semibold text-gold shrink-0">
                ${p.price}/wk
              </span>
              <div className="flex gap-1 flex-wrap justify-end">
                {p.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-500 dark:text-slate-400 leading-tight"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
