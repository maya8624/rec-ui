import { useState } from 'react'
import { actionResponses, streamMessage } from '../data/copilot/demoData'
import type { CopilotMessage, SuburbSummaryResponse } from '../types/copilot'

export function useCopilotChat() {
  const [messages, setMessages] = useState<CopilotMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  async function handleSend(userText: string, responseOverride?: string) {
    if (isStreaming) return
    const userMsg: CopilotMessage = { id: crypto.randomUUID(), role: 'user', text: userText }
    const aiId = crypto.randomUUID()
    const aiMsg: CopilotMessage = { id: aiId, role: 'ai', text: '', streaming: true }
    setMessages(prev => [...prev, userMsg, aiMsg])
    setIsStreaming(true)
    const matchKey = Object.keys(actionResponses).find(k =>
      userText.toLowerCase().includes(k.toLowerCase())
    )
    const responseText = responseOverride ?? (matchKey ? actionResponses[matchKey] : 'Let me look into that for you.')
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

  function handleSendStructured(userText: string, suburbSummary: SuburbSummaryResponse) {
    const userMsg: CopilotMessage = { id: crypto.randomUUID(), role: 'user', text: userText }
    const aiMsg: CopilotMessage = {
      id: crypto.randomUUID(),
      role: 'ai',
      text: '',
      type: 'suburb-summary',
      suburbSummary,
    }
    setMessages(prev => [...prev, userMsg, aiMsg])
  }

  function addAiMessage(text: string) {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', text }])
  }

  return { messages, isStreaming, handleSend, handleAction, handleSendStructured, addAiMessage }
}
