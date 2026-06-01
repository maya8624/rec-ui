import { FileText, File, AlignLeft } from 'lucide-react'
import { ragContextInfo } from '../../../data/agent/demoData'
import type { IndexedDocument, DocType } from '../../../types/agent'

function DocIcon({ type }: { type: DocType }) {
  if (type === 'pdf') return <FileText className="w-3 h-3 text-red-500 flex-shrink-0" />
  if (type === 'docx') return <File className="w-3 h-3 text-blue-500 flex-shrink-0" />
  return <AlignLeft className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
}

interface Props {
  propertyId: string | null
}

export function DocumentList({ propertyId }: Props) {
  const docs: IndexedDocument[] = []

  return (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-1 pb-2">
        Indexed Documents
      </p>
      <div className="flex flex-col gap-0.5 px-2">
        {docs.map(doc => (
          <div key={doc.id} className="flex items-start gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
            <span className="mt-0.5"><DocIcon type={doc.type} /></span>
            <div className="min-w-0">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">{doc.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{doc.chunks} chunks</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-3 border-t border-slate-200 dark:border-slate-700 pt-3 pb-2">
        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">RAG Context</p>
        <div className="space-y-1.5">
          {[
            { label: 'Embed model', value: ragContextInfo.embedModel },
            { label: 'Index type', value: ragContextInfo.indexType },
            { label: 'Agency', value: ragContextInfo.tenant },
            { label: 'Property ID', value: propertyId ?? '—' },
          ].map(row => (
            <div key={row.label} className="flex justify-between gap-2 text-xs">
              <span className="text-slate-400 dark:text-slate-500">{row.label}</span>
              <span className="text-slate-600 dark:text-slate-300 text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
