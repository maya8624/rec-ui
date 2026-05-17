interface Props {
  steps: string[]
  onAction: (label: string) => void
  disabled?: boolean
}

export function SuggestedSteps({ steps, onAction, disabled }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step) => (
        <button
          key={step}
          onClick={() => onAction(step)}
          disabled={disabled}
          className="flex items-start gap-3 w-full px-3 py-3 rounded-lg border border-slate-600 bg-slate-700 hover:border-gold/50 hover:bg-slate-600 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="text-gold shrink-0 mt-0.5">→</span>
          <span className="text-sm text-white leading-snug">{step}</span>
        </button>
      ))}
    </div>
  )
}
