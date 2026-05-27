import { useState } from 'react'
import { Send, RefreshCw } from 'lucide-react'
import { WorkflowFooter } from '../layout/WorkflowFooter'
import { enquiryWorkflowSteps } from '../../../data/agent/demoData'
import type { UseEnquiryDraftReturn } from '../../../hooks/useEnquiryDraft'
import type { Enquiry, EnquiryStatus } from '../../../types/agent'

function statusBadgeClass(status: EnquiryStatus) {
  if (status === 'new') return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
  if (status === 'drafted') return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
  if (status === 'replied') return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
  return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'  // closed
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

interface Props {
  enquiry: Enquiry | null
  draft: UseEnquiryDraftReturn
}

export function EnquiryDetail({ enquiry, draft }: Props) {
  const [editedDraft, setEditedDraft] = useState<string | null>(null)

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
      <div className="p-5 flex flex-col gap-5 md:flex-1 md:min-h-0 md:overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-slate-100">
              {enquiry.senderName ?? 'Tenant'}
            </p>
            <p className="text-xs text-slate-500">
              {enquiry.senderEmail ? `${enquiry.senderEmail} · ` : ''}{formatTime(enquiry.timestamp)}
            </p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-md border capitalize flex-shrink-0 ${statusBadgeClass(enquiry.status)}`}>
            {enquiry.status}
          </span>
        </div>

        {/* Enquiry body */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex-shrink-0">
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Enquiry</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line min-h-[120px]">{enquiry.message}</p>
        </div>

        {/* Reply panel — flex-1 so it fills space between enquiry body and buttons */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            {draft.isReadOnly ? (
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Sent
              </span>
            ) : (
              <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                AI
              </span>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {draft.isReadOnly ? 'Sent reply' : 'Drafted reply'}
            </p>
            {draft.isLoading && (
              <span className="text-xs text-slate-400 dark:text-slate-600 ml-auto animate-pulse">Generating…</span>
            )}
          </div>

          {draft.error && <p className="text-xs text-red-500 px-4 py-3">{draft.error}</p>}

          {!draft.isLoading && draft.draft && (
            <>
              <textarea
                className="w-full bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 p-4 resize-none leading-relaxed focus:outline-none flex-1 min-h-[160px] scrollbar-none"
                value={draftText}
                onChange={e => setEditedDraft(e.target.value)}
                disabled={draft.isReadOnly || draft.isSending}
                readOnly={draft.isReadOnly}
              />
              {draft.draft.sources.length > 0 && (
                <div className="px-4 pb-3 border-t border-slate-200 dark:border-slate-700 pt-3 flex-shrink-0">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5">Context sources</p>
                  <div className="flex flex-wrap gap-1.5">
                    {draft.draft.sources.map((src, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions — only shown for editable drafts */}
        {!draft.isReadOnly && !draft.isLoading && draft.draft && (
          <div className="flex flex-col gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => draft.send()}
                disabled={draft.isSending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-navy-900 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {draft.isSending ? 'Sending…' : 'Send'}
              </button>
              <button
                onClick={() => { setEditedDraft(null); draft.refetch() }}
                disabled={draft.isSending}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>
            {draft.sendError && (
              <p className="text-xs text-red-500">{draft.sendError}</p>
            )}
          </div>
        )}
      </div>

      <WorkflowFooter steps={enquiryWorkflowSteps} />
    </div>
  )
}
