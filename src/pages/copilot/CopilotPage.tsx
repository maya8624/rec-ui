import { useEffect } from 'react'
import { useCopilotChat } from '../../hooks/useCopilotChat'
import { usePreferences } from '../../hooks/usePreferences'
import { CopilotHeader } from '../../components/copilot/layout/CopilotHeader'
import { LeftColumn } from '../../components/copilot/layout/LeftColumn'
import { CopilotPanel } from '../../components/copilot/layout/CopilotPanel'
import { properties as demoProperties, workflowSteps, suggestedSteps } from '../../data/copilot/demoData'
import { mockPreferencePayload } from '../../api/preferencesApi'
import type { Property } from '../../types/copilot'

export default function CopilotPage() {
  const { messages, isStreaming, handleSend, handleAction } = useCopilotChat()
  const { mutate: fetchPreferences, data: preferenceData, isPending } = usePreferences()

  useEffect(() => {
    fetchPreferences(mockPreferencePayload)
  }, [fetchPreferences])

  const properties: Property[] = preferenceData
    ? (preferenceData.listings as Property[])
    : demoProperties

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col p-4 gap-4">
        <CopilotHeader />
        <div className="flex flex-col md:flex-row items-start">
          <LeftColumn properties={properties} onAction={handleAction} disabled={isStreaming || isPending} />
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
