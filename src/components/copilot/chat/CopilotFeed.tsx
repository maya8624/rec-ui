import { useEffect, useRef } from 'react'
import type { CopilotMessage } from '../../../types/copilot'
import { UserMessage } from './UserMessage'
import { AiMessage } from './AiMessage'
import { PreferenceSummaryCard } from './PreferenceSummaryCard'
import { CopilotTypingIndicator } from './CopilotTypingIndicator'

interface Props {
  messages: CopilotMessage[]
  isWaiting?: boolean
  isStreaming?: boolean
}

export function CopilotFeed({ messages, isWaiting, isStreaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isWaiting, isStreaming])

  const visibleMessages = messages.filter(
    (msg) => msg.role !== 'ai' || msg.text.length > 0 || !!msg.type
  )

  const showIndicator = isWaiting || (isStreaming && visibleMessages.length < messages.length)

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <PreferenceSummaryCard />
      <div className="flex flex-col gap-3 px-4 pb-4">
        {visibleMessages.map((msg) =>
          msg.role === 'user' ? (
            <UserMessage key={msg.id} message={msg} />
          ) : (
            <AiMessage key={msg.id} message={msg} />
          )
        )}
        {showIndicator && <CopilotTypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
