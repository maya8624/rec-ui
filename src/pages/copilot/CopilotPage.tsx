import { useCopilotChat } from '../../hooks/useCopilotChat'
import { CopilotHeader } from '../../components/copilot/layout/CopilotHeader'
import { LeftColumn } from '../../components/copilot/layout/LeftColumn'
import { CopilotPanel } from '../../components/copilot/layout/CopilotPanel'
import { properties, workflowSteps, suggestedSteps } from '../../data/copilot/demoData'

export default function CopilotPage() {
  const { messages, isStreaming, handleSend, handleAction } = useCopilotChat()

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col p-4 gap-4">
        <CopilotHeader />
        <div className="flex flex-col md:flex-row items-start">
          <LeftColumn properties={properties} onAction={handleAction} disabled={isStreaming} />
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
