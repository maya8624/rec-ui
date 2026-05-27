import { Bed, DollarSign, MapPin } from 'lucide-react'

export function FilterBar() {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-navy-600 overflow-x-auto flex-shrink-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
      {/* Filter selects */}
      <div className="flex items-center gap-1.5 border border-gold/40 text-gold bg-gold/10 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer shrink-0">
        <Bed className="w-3 h-3" />
        2–3 bed
      </div>
      <div className="flex items-center gap-1.5 bg-navy-800 border border-navy-600 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer shrink-0">
        <DollarSign className="w-3 h-3" />
        Under $950/wk
      </div>
      <div className="flex items-center gap-1.5 bg-navy-800 border border-navy-600 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer shrink-0">
        <MapPin className="w-3 h-3" />
        Bondi · Surry Hills
      </div>

      {/* Filter chips */}
      <span className="rounded-full border border-gold text-gold text-xs px-2.5 py-1 cursor-pointer shrink-0">
        Pet friendly
      </span>
      <span className="rounded-full border border-navy-600 text-slate-400 text-xs px-2.5 py-1 cursor-pointer shrink-0">
        Parking
      </span>
      <span className="rounded-full border border-navy-600 text-slate-400 text-xs px-2.5 py-1 cursor-pointer shrink-0">
        Furnished
      </span>
      <span className="rounded-full border border-navy-600 text-slate-400 text-xs px-2.5 py-1 cursor-pointer shrink-0">
        Available now
      </span>

      <span className="ml-auto text-xs text-navy-500 whitespace-nowrap shrink-0 pl-2">
        4 results
      </span>
    </div>
  )
}
