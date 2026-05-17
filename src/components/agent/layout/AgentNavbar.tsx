import { Building2 } from 'lucide-react'
import type { AgentTab } from '../../../types/agent'

const TABS: { id: AgentTab; label: string }[] = [
  { id: 'enquiry', label: 'Enquiry Handling' },
  { id: 'documents', label: 'Document Search' },
  { id: 'upload', label: 'File Upload' },
]

interface Props {
  activeTab: AgentTab
  onTabChange: (tab: AgentTab) => void
}

export function AgentNavbar({ activeTab, onTabChange }: Props) {
  return (
    <header className="flex items-center gap-3 flex-wrap px-1">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
          <Building2 className="w-4 h-4 text-navy-900" />
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">rec-brain</span>
      </div>

      <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300">
        Harbour Realty Group
      </span>
      <span className="text-xs px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-300">
        Agent mode
      </span>

      <div className="flex items-center gap-1 ml-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-0.5 rounded text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1" />
      <span className="text-xs text-slate-400 dark:text-slate-500">Sydney · Agent</span>
    </header>
  )
}
