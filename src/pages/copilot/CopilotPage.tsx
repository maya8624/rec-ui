import { useRef, useState } from 'react'
import { useCopilotChat } from '../../hooks/useCopilotChat'
import { CopilotHeader } from '../../components/copilot/layout/CopilotHeader'
import { LeftColumn } from '../../components/copilot/layout/LeftColumn'
import { CopilotPanel } from '../../components/copilot/layout/CopilotPanel'
import { workflowSteps, suggestedSteps } from '../../data/copilot/demoData'
import { fetchSuburbSummary } from '../../api/preferencesApi'
import type { ListingItem } from '../../types/copilot'

const FIND_PROPERTIES_MESSAGE = 'Find me a 2 or 3 bedroom pet friendly property in Bondi Beach, Surry Hills under $950/wk available within 14 day'

export default function CopilotPage() {
  const { messages, isStreaming, handleSend, handleAction: chatHandleAction, handleSendStructured, handleStreamFromApi } = useCopilotChat()
  const [properties, setProperties] = useState<ListingItem[]>([])
  const matchesSentRef = useRef(false)
  const suburbSummarySentRef = useRef(false)
  const [isFetchingSummary, setIsFetchingSummary] = useState(false)

  async function handleAction(label: string) {
    if (label === 'Find matching properties') {
      if (matchesSentRef.current) return
      matchesSentRef.current = true
      await handleStreamFromApi(
        FIND_PROPERTIES_MESSAGE,
        { message: FIND_PROPERTIES_MESSAGE, propertyId: null, threadId: null },
        (listings) => setProperties(listings),
      )
      return
    }
    if (label === 'Suburb summary') {
      if (suburbSummarySentRef.current || isFetchingSummary || isStreaming) return
      suburbSummarySentRef.current = true
      const suburbs = ['Bondi Beach', 'Surry Hills']
      setIsFetchingSummary(true)
      try {
        const result = await fetchSuburbSummary(suburbs)
        if (result.suburbs?.length) {
          handleSendStructured(`Give me a suburb summary for ${suburbs.join(', ')}`, result)
        } else {
          await handleSend(`Give me a suburb summary for ${suburbs.join(', ')}`, 'Suburb summary is not available yet.')
        }
      } catch {
        await handleSend(`Give me a suburb summary for ${suburbs.join(', ')}`, 'Failed to load suburb summary. Please try again.')
      } finally {
        setIsFetchingSummary(false)
      }
      return
    }
    chatHandleAction(label)
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col p-4 gap-4">
        <CopilotHeader />
        <div className="flex flex-col md:flex-row items-start">
          <LeftColumn
            onAction={handleAction}
            disabled={isStreaming || isFetchingSummary}
            steps={workflowSteps}
            suggestedSteps={suggestedSteps}
          />
          <CopilotPanel
            messages={messages}
            properties={properties}
            listingsError={false}
            onSend={handleSend}
            isStreaming={isStreaming}
            isWaiting={isFetchingSummary}
          />
        </div>
      </div>
    </div>
  )
}
