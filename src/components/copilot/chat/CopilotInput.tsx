import { useState } from 'react'
import { ArrowUp } from 'lucide-react'

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export function CopilotInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <div className="px-4 py-3 flex-shrink-0">
      <div
        className={`flex items-center gap-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Ask anything..."
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-0"
        />
        <button
          onClick={submit}
          disabled={!value.trim() || disabled}
          aria-label="Send"
          className="w-7 h-7 rounded-md bg-gold flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  )
}
