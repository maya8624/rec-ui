import type { SuburbSummaryResponse } from '../../../types/copilot'

export function SuburbSummaryMessage({ data }: { data: SuburbSummaryResponse }) {
  const suburbs = data.suburbs ?? []

  if (suburbs.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">No suburb data available.</p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {suburbs.map((suburb, i) => (
        <div key={suburb.name ?? i} className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {suburb.name}
          </span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {suburb.description}
          </p>
          <div className="mt-1 flex flex-col gap-0.5 text-sm text-slate-700 dark:text-slate-300">
            {suburb.rents.oneBedroom && <span>1 bedroom: {suburb.rents.oneBedroom}</span>}
            {suburb.rents.twoBedroom && <span>2 bedroom: {suburb.rents.twoBedroom}</span>}
            {suburb.rents.threeBedroom && <span>3 bedroom: {suburb.rents.threeBedroom}</span>}
            {suburb.vacancyRate && <span>Vacancy rate: {suburb.vacancyRate}</span>}
            {suburb.trend && <span>Trend: {suburb.trend}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
