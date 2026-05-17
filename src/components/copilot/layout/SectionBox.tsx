export function SectionBox({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm${className ? ` ${className}` : ''}`}>
      <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-4 pb-3">{label}</p>
      <div className="px-4 pb-4">{children}</div>
    </div>
  )
}
