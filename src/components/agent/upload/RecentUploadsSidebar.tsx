import type { UploadedFile, UploadStatus } from '../../../types/agent'

function statusText(status: UploadStatus) {
  if (status === 'indexed') return <span className="text-emerald-600 dark:text-emerald-400">Indexed</span>
  if (status === 'processing') return <span className="text-amber-500 dark:text-amber-400 animate-pulse">Processing</span>
  return <span className="text-red-500 dark:text-red-400">Error</span>
}

export function RecentUploadsSidebar({ uploads }: { uploads: UploadedFile[] }) {
  return (
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-1 pb-2">
        Recent Uploads
      </p>
      <div className="flex flex-col gap-0.5 px-2">
        {uploads.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 px-2">No uploads yet</p>
        )}
        {uploads.map(u => (
          <div key={u.id} className="px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
            <p className="text-xs text-slate-700 dark:text-slate-300 truncate">{u.filename}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-400 dark:text-slate-500">{u.sizeMb} MB</span>
              <span className="text-xs">{statusText(u.status)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
