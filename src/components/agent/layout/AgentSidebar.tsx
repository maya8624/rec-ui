import { useState, useEffect } from 'react'
import { Inbox, FileSearch, Upload } from 'lucide-react'
import type { ReactNode } from 'react'
import { EnquiryQueue } from '../enquiry/EnquiryQueue'
import { DocumentList } from '../documents/DocumentList'
import { RecentUploadsSidebar } from '../upload/RecentUploadsSidebar'
import type { AgentTab, Enquiry, EnquiryStatus, UploadedFile } from '../../../types/agent'

const NAV_ITEMS: { id: AgentTab; label: string; icon: ReactNode }[] = [
  { id: 'enquiry', label: 'Enquiry Handling', icon: <Inbox className="w-4 h-4" /> },
  { id: 'documents', label: 'Document Search', icon: <FileSearch className="w-4 h-4" /> },
  { id: 'upload', label: 'File Upload', icon: <Upload className="w-4 h-4" /> },
]

const STATUS_FILTERS: { value: EnquiryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'drafted', label: 'Drafted' },
  { value: 'replied', label: 'Replied' },
  { value: 'closed', label: 'Closed' },
]

function dotClass(status: EnquiryStatus) {
  if (status === 'new') return 'bg-blue-500'
  if (status === 'drafted') return 'bg-amber-400'
  if (status === 'replied') return 'bg-emerald-500'
  return 'bg-slate-400'   // closed
}

interface Props {
  activeTab: AgentTab
  onTabChange: (tab: AgentTab) => void
  enquiries: Enquiry[]
  enquiriesLoading: boolean
  enquiriesError: string | null
  onRetryEnquiries: () => void
  selectedEnquiryId: string | null
  onSelectEnquiry: (id: string | null) => void
  uploads: UploadedFile[]
  isGenerating: boolean
}

export function AgentSidebar({
  activeTab,
  onTabChange,
  enquiries,
  enquiriesLoading,
  enquiriesError,
  onRetryEnquiries,
  selectedEnquiryId,
  onSelectEnquiry,
  uploads,
  isGenerating,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all')

  const filteredEnquiries =
    statusFilter === 'all' ? enquiries : enquiries.filter(e => e.status === statusFilter)

  // When filter changes, if selected enquiry is no longer visible → auto-select first
  useEffect(() => {
    if (!filteredEnquiries.find(e => e.id === selectedEnquiryId)) {
      onSelectEnquiry(filteredEnquiries[0]?.id ?? null)
    }
  }, [statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-select first enquiry when data first loads
  useEffect(() => {
    if (!selectedEnquiryId && filteredEnquiries.length > 0) {
      onSelectEnquiry(filteredEnquiries[0].id)
    }
  }, [enquiries]) // eslint-disable-line react-hooks/exhaustive-deps

  function countFor(status: EnquiryStatus) {
    return enquiries.filter(e => e.status === status).length
  }

  return (
    <div className="flex flex-col gap-3 w-full md:w-[250px] md:flex-shrink-0 md:pr-4 md:min-h-0">
      {/* Nav card */}
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

      {/* Context card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden md:flex-1 md:min-h-0">
        <div className="overflow-y-auto max-h-[380px] md:max-h-none md:h-full py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">

          {activeTab === 'enquiry' && (
            <>
              {/* Status filter pills */}
              <div className="px-3 pt-1 pb-2 flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map(f => {
                  const count = f.value === 'all' ? enquiries.length : countFor(f.value)
                  const isActive = statusFilter === f.value
                  return (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                          : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {f.value !== 'all' && (
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClass(f.value as EnquiryStatus)}`} />
                      )}
                      {f.label}
                      <span className={`ml-0.5 ${isActive ? 'text-indigo-400 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {enquiriesLoading && (
                <p className="text-xs text-slate-400 dark:text-slate-500 px-4 py-3 animate-pulse">
                  Loading enquiries…
                </p>
              )}

              {enquiriesError && (
                <div className="px-4 py-3 flex flex-col gap-1.5">
                  <p className="text-xs text-red-500">{enquiriesError}</p>
                  <button
                    onClick={onRetryEnquiries}
                    className="self-start text-xs text-indigo-500 dark:text-indigo-400 hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!enquiriesLoading && !enquiriesError && filteredEnquiries.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 px-4 py-3">
                  No {statusFilter === 'all' ? '' : statusFilter} enquiries.
                </p>
              )}

              {!enquiriesLoading && filteredEnquiries.length > 0 && (
                <EnquiryQueue
                  enquiries={filteredEnquiries}
                  selectedId={selectedEnquiryId}
                  onSelect={onSelectEnquiry}
                  isGenerating={isGenerating}
                />
              )}
            </>
          )}

          {activeTab === 'documents' && <DocumentList />}
          {activeTab === 'upload' && <RecentUploadsSidebar uploads={uploads} />}
        </div>
      </div>
    </div>
  )
}
