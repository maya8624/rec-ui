import { useRef, useState } from 'react'
import { useCopilotChat } from '../../hooks/useCopilotChat'
import { usePreferences } from '../../hooks/usePreferences'
import { CopilotHeader } from '../../components/copilot/layout/CopilotHeader'
import { LeftColumn } from '../../components/copilot/layout/LeftColumn'
import { CopilotPanel } from '../../components/copilot/layout/CopilotPanel'
import { workflowSteps, suggestedSteps } from '../../data/copilot/demoData'
import { mockPreferencePayload, fetchSuburbSummary } from '../../api/preferencesApi'
import type { ListingItem } from '../../types/copilot'

export default function CopilotPage() {
  const { messages, isStreaming, handleSend, handleAction: chatHandleAction, handleSendStructured } = useCopilotChat()
  const { data, isLoading, isError, refetch } = usePreferences()
  const [properties, setProperties] = useState<ListingItem[]>([])
  const matchesSentRef = useRef(false)
  const [isFetchingSummary, setIsFetchingSummary] = useState(false)

  async function handleAction(label: string) {
    if (label === 'Find matching properties') {
      if (matchesSentRef.current) return
      matchesSentRef.current = true
      const result = await refetch()
      setProperties(result.data?.listings ?? [])
      await handleSend('Find matching properties', result.data?.message)
      return
    }
    if (label === 'Suburb summary') {
      if (isFetchingSummary || isStreaming) return
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
          <LeftColumn properties={properties} onAction={handleAction} disabled={isStreaming || isLoading || isFetchingSummary} listingsError={isError} />
          <CopilotPanel
            messages={messages}
            steps={workflowSteps}
            suggestedSteps={suggestedSteps}
            onAction={handleAction}
            onSend={handleSend}
            isStreaming={isStreaming}
            isWaiting={isLoading || isFetchingSummary}
          />
        </div>
      </div>
    </div>
  )
}
