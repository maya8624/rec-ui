import { Link } from 'react-router-dom'
import { Building2, House } from 'lucide-react'

export function CopilotHeader() {
  return (
    <header className="flex items-center gap-3 px-1">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
          <Building2 className="w-4 h-4 text-navy-900" />
        </div>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300">
        Harbour Realty Group
      </span>
      <div className="flex-1" />
      <Link
        to="/"
        className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors no-underline"
      >
        <House className="w-3.5 h-3.5" />
        Home
      </Link>
      <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500">Sydney · Rental</span>
    </header>
  )
}
