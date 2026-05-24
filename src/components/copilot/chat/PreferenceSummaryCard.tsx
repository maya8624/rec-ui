import { mockPreferencePayload } from '../../../api/actionApi'

const { suburbs, minBeds, maxBeds, maxRent, petFriendly, availableWithinDays } = mockPreferencePayload

const rows: { label: string; value: string }[] = [
  { label: 'Suburbs', value: suburbs.join(', ') },
  { label: 'Budget', value: `Up to $${maxRent}/wk` },
  { label: 'Bedrooms', value: minBeds === maxBeds ? `${minBeds}` : `${minBeds}–${maxBeds}` },
  { label: 'Pet friendly', value: petFriendly ? 'Yes' : 'No' },
  { label: 'Available', value: `Within ${availableWithinDays} days` },
]

export function PreferenceSummaryCard() {
  return (
    <div className="mx-4 mt-4 mb-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
        Your Search Preferences
      </p>
      <div className="flex flex-col gap-1">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-baseline gap-2 text-xs">
            <span className="w-24 flex-shrink-0 text-slate-400 dark:text-slate-500">{label}</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
