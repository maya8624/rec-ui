import { useState } from 'react'
import { initialMessages, actionResponses, streamMessage } from '../data/copilot/demoData'
import type { CopilotMessage } from '../types/copilot'

export function useCopilotChat() {
  const [messages, setMessages] = useState<CopilotMessage[]>(initialMessages)
  const [isStreaming, setIsStreaming] = useState(false)

  async function handleSend(userText: string, responseOverride?: string) {
    if (isStreaming) return
    const userMsg: CopilotMessage = { id: crypto.randomUUID(), role: 'user', text: userText }
    const aiId = crypto.randomUUID()
    const aiMsg: CopilotMessage = { id: aiId, role: 'ai', text: '', streaming: true }
    setMessages(prev => [...prev, userMsg, aiMsg])
    setIsStreaming(true)
    let responseText = responseOverride
    if (!responseText) {
      const matchKey = Object.keys(actionResponses).find(k =>
        userText.toLowerCase().includes(k.toLowerCase())
      )
      responseText = matchKey ? actionResponses[matchKey] : 'Let me look into that for you.'
    }
    await streamMessage(
      responseText,
      (chunk) =>
        setMessages(prev =>
          prev.map(m => (m.id === aiId ? { ...m, text: m.text + chunk } : m))
        ),
      () => {
        setMessages(prev =>
          prev.map(m => (m.id === aiId ? { ...m, streaming: false } : m))
        )
        setIsStreaming(false)
      }
    )
  }

  function handleAction(label: string) {
    handleSend(label)
  }

  return { messages, isStreaming, handleSend, handleAction }
}
