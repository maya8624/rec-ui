export function MapPanel() {
  return (
    <div className="h-[100px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg relative overflow-hidden flex items-center justify-center">
      <span className="text-xs text-slate-400 dark:text-slate-500 select-none">Map renders here (Google Maps / Leaflet)</span>
      <span className="absolute w-3 h-3 rounded-full border-2 border-slate-400 bg-transparent" style={{ top: '33%', left: '33%' }} />
      <span className="absolute w-3 h-3 rounded-full border-2 border-slate-400 bg-transparent" style={{ top: '50%', left: '52%' }} />
      <span className="absolute w-3 h-3 rounded-full border-2 border-slate-400 bg-transparent" style={{ top: '27%', left: '66%' }} />
    </div>
  )
}
