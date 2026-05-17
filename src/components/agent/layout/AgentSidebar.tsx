import { Inbox, FileSearch, Upload } from 'lucide-react'
import type { ReactNode } from 'react'
import { EnquiryQueue } from '../enquiry/EnquiryQueue'
import { DocumentList } from '../documents/DocumentList'
import { RecentUploadsSidebar } from '../upload/RecentUploadsSidebar'
import { enquiries } from '../../../data/agent/demoData'
import type { AgentTab, UploadedFile } from '../../../types/agent'

const NAV_ITEMS: { id: AgentTab; label: string; icon: ReactNode }[] = [
  { id: 'enquiry', label: 'Enquiry Handling', icon: <Inbox className="w-4 h-4" /> },
  { id: 'documents', label: 'Document Search', icon: <FileSearch className="w-4 h-4" /> },
  { id: 'upload', label: 'File Upload', icon: <Upload className="w-4 h-4" /> },
]

interface Props {
  activeTab: AgentTab
  onTabChange: (tab: AgentTab) => void
  selectedEnquiryId: string | null
  onSelectEnquiry: (id: string) => void
  uploads: UploadedFile[]
}

export function AgentSidebar({ activeTab, onTabChange, selectedEnquiryId, onSelectEnquiry, uploads }: Props) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-[250px] md:flex-shrink-0 md:pr-4 md:min-h-0">
      {/* Nav card — always fixed height */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-4 pb-3">
          Navigation
        </p>
        <nav className="flex flex-col gap-1 px-3 pb-3">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left w-full ${
                activeTab === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Context card — capped on mobile, fills remaining height on desktop */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden md:flex-1 md:min-h-0">
        <div className="overflow-y-auto max-h-[380px] md:max-h-none md:h-full py-2">
          {activeTab === 'enquiry' && (
            <EnquiryQueue
              enquiries={enquiries}
              selectedId={selectedEnquiryId}
              onSelect={onSelectEnquiry}
            />
          )}
          {activeTab === 'documents' && <DocumentList />}
          {activeTab === 'upload' && <RecentUploadsSidebar uploads={uploads} />}
        </div>
      </div>
    </div>
  )
}
