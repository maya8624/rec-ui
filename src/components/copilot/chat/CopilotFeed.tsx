import { useEffect, useRef } from 'react'
import type { CopilotMessage } from '../../../types/copilot'
import { UserMessage } from './UserMessage'
import { AiMessage } from './AiMessage'
import { PreferenceSummaryCard } from './PreferenceSummaryCard'
import { CopilotTypingIndicator } from './CopilotTypingIndicator'

interface Props {
  messages: CopilotMessage[]
  isWaiting?: boolean
}

export function CopilotFeed({ messages, isWaiting }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0">
      <PreferenceSummaryCard />
      <div className="flex flex-col gap-3 px-4 pb-4">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage key={msg.id} message={msg} />
        ) : (
          <AiMessage key={msg.id} message={msg} />
        )
      )}
      {isWaiting && <CopilotTypingIndicator />}
      <div ref={bottomRef} />
      </div>
    </div>
  )
}
