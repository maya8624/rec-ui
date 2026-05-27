import { useState, useRef, useCallback } from 'react'
import { Upload, CheckCircle, Loader2, XCircle } from 'lucide-react'
import { WorkflowFooter } from '../layout/WorkflowFooter'
import { uploadWorkflowSteps } from '../../../data/agent/demoData'
import type { UploadedFile, UploadStatus } from '../../../types/agent'

function StatusIcon({ status }: { status: UploadStatus }) {
  if (status === 'indexed') return <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
  if (status === 'processing') return <Loader2 className="w-4 h-4 text-amber-500 animate-spin flex-shrink-0" />
  return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
}

function statusLabelClass(status: UploadStatus) {
  if (status === 'indexed') return 'text-emerald-600 dark:text-emerald-400'
  if (status === 'processing') return 'text-amber-500 dark:text-amber-400'
  return 'text-red-500 dark:text-red-400'
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

interface Props {
  uploads: UploadedFile[]
  isUploading: boolean
  error: string | null
  onUpload: (file: File) => void
}

export function UploadPanel({ uploads, isUploading, error, onUpload }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }, [onUpload])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden md:flex-1 md:min-h-0 md:flex md:flex-col">
      <div className="p-5 space-y-5 md:flex-1 md:min-h-0 md:overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
        <div
          onDragEnter={e => { e.preventDefault(); setIsDragging(true) }}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 md:p-12 flex flex-col items-center gap-3 transition-colors ${
            isUploading
              ? 'border-slate-200 dark:border-slate-700 cursor-default'
              : isDragging
              ? 'border-gold bg-amber-50 dark:bg-amber-500/5 cursor-copy'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer'
          }`}
        >
          <input ref={inputRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleChange} />
          {isUploading
            ? <Loader2 className="w-9 h-9 text-gold animate-spin" />
            : <Upload className={`w-9 h-9 ${isDragging ? 'text-gold' : 'text-slate-400 dark:text-slate-500'}`} />
          }
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {isUploading ? 'Uploading…' : 'Drop file here or click to browse'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">PDF, DOCX, TXT · max 20 MB</p>
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}

        {uploads.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Recent Uploads</p>
            <div className="space-y-2">
              {uploads.map(u => (
                <div key={u.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3">
                  <StatusIcon status={u.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{u.filename}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{u.sizeMb} MB · {formatTime(u.uploadedAt)}</p>
                  </div>
                  <span className={`text-xs capitalize flex-shrink-0 ${statusLabelClass(u.status)}`}>
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <WorkflowFooter steps={uploadWorkflowSteps} />
    </div>
  )
}
