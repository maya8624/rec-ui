import type { Enquiry, EnquiryStatus } from '../../../types/agent'

function dotClass(status: EnquiryStatus) {
  if (status === 'new') return 'bg-blue-500'
  if (status === 'drafted') return 'bg-amber-400'
  if (status === 'replied') return 'bg-emerald-500'
  return 'bg-slate-400'   // closed
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

interface Props {
  enquiries: Enquiry[]
  selectedId: string | null
  onSelect: (id: string) => void
  isGenerating?: boolean
}

export function EnquiryQueue({ enquiries, selectedId, onSelect, isGenerating = false }: Props) {
  return (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-1 pb-2">
        Enquiry Queue
      </p>
      <div className="flex flex-col gap-0.5 px-2">
        {enquiries.map(enq => {
          const isSelected = selectedId === enq.id
          const isLocked = isGenerating && !isSelected
          return (
          <button
            key={enq.id}
            onClick={() => onSelect(enq.id)}
            disabled={isLocked}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
              isSelected
                ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20'
                : isLocked
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass(enq.status)}`} />
              <span className="text-xs font-medium text-gray-900 dark:text-slate-200 truncate">{enq.senderName ?? 'Tenant'}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 truncate pl-4">{enq.preview}</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 pl-4 mt-0.5">{formatTime(enq.timestamp)}</p>
          </button>
          )
        })}
      </div>
    </div>
  )
}
