import { Search, MapPin, Calendar, CreditCard, FileText } from 'lucide-react'

interface Props {
  onAction: (label: string) => void
  disabled?: boolean
}

const actions = [
  { label: 'Find matching properties', icon: Search, primary: true },
  { label: 'Suburb summary', icon: MapPin },
  { label: 'Book inspection', icon: Calendar },
  { label: 'Pay deposit', icon: CreditCard },
  { label: 'View tenancy docs', icon: FileText },
]

export function ActionsPanel({ onAction, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {actions.map(({ label, icon: Icon, primary }) => (
        <button
          key={label}
          onClick={() => onAction(label)}
          disabled={disabled}
          className={`flex items-center gap-2 px-2.5 py-1.5 w-full rounded-md border text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
            ${primary
              ? 'border-gold/50 bg-gold/5 text-gold hover:bg-gold/10 hover:border-gold font-medium'
              : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-gold/60 hover:text-gold'
            }`}
        >
          <Icon className="w-3 h-3 shrink-0" />
          {label}
        </button>
      ))}
    </div>
  )
}
