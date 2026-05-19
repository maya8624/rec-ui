import { useRef } from 'react'
import { useCopilotChat } from '../../hooks/useCopilotChat'
import { usePreferences } from '../../hooks/usePreferences'
import { CopilotHeader } from '../../components/copilot/layout/CopilotHeader'
import { LeftColumn } from '../../components/copilot/layout/LeftColumn'
import { CopilotPanel } from '../../components/copilot/layout/CopilotPanel'
import { workflowSteps, suggestedSteps } from '../../data/copilot/demoData'
import { mockPreferencePayload } from '../../api/preferencesApi'

export default function CopilotPage() {
  const { messages, isStreaming, handleSend, handleAction: chatHandleAction } = useCopilotChat()
  const { data, isLoading, isError } = usePreferences()
  const properties = data?.listings ?? []
  const matchesSentRef = useRef(false)

  async function handleAction(label: string) {
    if (label === 'Find matching properties') {
      if (matchesSentRef.current) return
      matchesSentRef.current = true
      await handleSend('Find matching properties', data?.message)
      return
    }
    if (label === 'Suburb summary') {
      const suburbs = mockPreferencePayload.suburbs.join(', ')
      await handleSend(`Give me a suburb summary for ${suburbs}`)
      return
    }
    chatHandleAction(label)
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col p-4 gap-4">
        <CopilotHeader />
        <div className="flex flex-col md:flex-row items-start">
          <LeftColumn properties={properties} onAction={handleAction} disabled={isStreaming || isLoading} listingsError={isError} />
          <CopilotPanel
            messages={messages}
            steps={workflowSteps}
            suggestedSteps={suggestedSteps}
            onAction={handleAction}
            onSend={handleSend}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  )
}
