import { useState, useCallback } from 'react'
import { sendChatmessage } from '../api/copilotApi'
import type { DocMessage } from '../types/agent'

export function useDocumentSearch() {
  const [messages, setMessages] = useState<DocMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (isLoading || !query.trim()) return
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: query }])
    setIsLoading(true)
    setError(null)
    try {
      const res = await sendChatmessage({ message: query, propertyId: null, threadId: null })
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'ai', content: res.reply, sources: res.sources ?? [] },
      ])
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  return { messages, isLoading, error, search }
}
