import { useState } from 'react'
import { Send, Edit2, RefreshCw } from 'lucide-react'
import { WorkflowFooter } from '../layout/WorkflowFooter'
import { enquiries, enquiryWorkflowSteps } from '../../../data/agent/demoData'
import type { UseEnquiryDraftReturn } from '../../../hooks/useEnquiryDraft'
import type { EnquiryStatus } from '../../../types/agent'

function statusBadgeClass(status: EnquiryStatus) {
  if (status === 'new') return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
  if (status === 'replied') return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
  return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

interface Props {
  enquiryId: string | null
  draft: UseEnquiryDraftReturn
}

export function EnquiryDetail({ enquiryId, draft }: Props) {
  const [editedDraft, setEditedDraft] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const enquiry = enquiries.find(e => e.id === enquiryId)
  const draftText = editedDraft ?? draft.draft?.draft ?? ''

  if (!enquiry) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex items-center justify-center h-[200px] md:flex-1 md:min-h-0 text-slate-400 dark:text-slate-500 text-sm">
        Select an enquiry from the queue
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-1 md:min-h-0">
      {/* content scrolls internally on both mobile and desktop */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5 max-h-[600px] md:max-h-none">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-slate-100">{enquiry.sender}</p>
            <p className="text-xs text-slate-500">{enquiry.email} · {formatTime(enquiry.timestamp)}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-md border capitalize flex-shrink-0 ${statusBadgeClass(enquiry.status)}`}>
            {enquiry.status}
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Enquiry</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{enquiry.message}</p>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              AI
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Drafted reply</p>
            {draft.isLoading && (
              <span className="text-xs text-slate-400 dark:text-slate-600 ml-auto animate-pulse">Generating…</span>
            )}
          </div>

          {draft.error && <p className="text-xs text-red-500 px-4 py-3">{draft.error}</p>}

          {!draft.isLoading && draft.draft && (
            <>
              <textarea
                className="w-full bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 p-4 resize-none leading-relaxed focus:outline-none min-h-[180px]"
                value={draftText}
                onChange={e => setEditedDraft(e.target.value)}
                disabled={sent}
              />
              <div className="px-4 pb-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">Context sources</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.draft.context_sources.map((src, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {!draft.isLoading && draft.draft && !sent && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSent(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-navy-900 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
            <button
              onClick={() => setEditedDraft(draft.draft?.draft ?? null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => { setEditedDraft(null); draft.refetch() }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
          </div>
        )}

        {sent && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Reply sent successfully
          </div>
        )}
      </div>

      <WorkflowFooter steps={enquiryWorkflowSteps} />
    </div>
  )
}
