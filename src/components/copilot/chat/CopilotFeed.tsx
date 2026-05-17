import { useEffect, useRef } from 'react'
import type { CopilotMessage } from '../../../types/copilot'
import { UserMessage } from './UserMessage'
import { AiMessage } from './AiMessage'

interface Props {
  messages: CopilotMessage[]
}

export function CopilotFeed({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage key={msg.id} message={msg} />
        ) : (
          <AiMessage key={msg.id} message={msg} />
        )
      )}
      <div ref={bottomRef} />
    </div>
  )
}
