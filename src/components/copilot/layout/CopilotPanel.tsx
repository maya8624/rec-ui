import { CopilotFeed } from '../chat/CopilotFeed'
import { CopilotInput } from '../chat/CopilotInput'
// import { MatchedListings } from '../actions/MatchedListings'
import type { CopilotMessage, ListingItem } from '../../../types/copilot'

interface Props {
  messages: CopilotMessage[]
  properties: ListingItem[]
  listingsError?: boolean
  onSend: (text: string, responseOverride?: string) => void
  isStreaming: boolean
  isWaiting?: boolean
}

export function CopilotPanel({ messages, onSend, isStreaming, isWaiting }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full md:flex-1 md:sticky md:top-4 md:border-l md:border-slate-200 dark:md:border-slate-700 md:pl-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm flex flex-col h-[calc(100vh-120px)]">
        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-4 flex-shrink-0">
          Copilot
        </p>
        <CopilotFeed messages={messages} isWaiting={isWaiting} isStreaming={isStreaming} />
        <CopilotInput onSend={onSend} disabled={isStreaming} />
      </div>

      {/* Matched Listings panel — hidden for now
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 pt-4 pb-3">
          {properties.length > 0 ? `Matched Listings · ${properties.length} Found` : 'Matched Listings'}
        </p>
        <div className="px-4 pb-4">
          {listingsError && (
            <p className="text-xs text-amber-500 mb-2">Something went wrong loading your matches.</p>
          )}
          <div className="max-h-[380px] overflow-y-auto pr-1">
            <MatchedListings properties={properties} />
          </div>
        </div>
      </div>
      */}
    </div>
  )
}
