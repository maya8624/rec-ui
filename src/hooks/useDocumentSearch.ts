import { useState, useCallback } from 'react'
import { streamChatMessage } from '../api/copilotApi'
import { mapSourceChunk } from '../api/agentApi'
import type { DocMessage } from '../types/agent'

export function useDocumentSearch(propertyId: string | null) {
  const [messages, setMessages] = useState<DocMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (isStreaming || !query.trim()) return

    const aiId = crypto.randomUUID()
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: query },
      { id: aiId, role: 'ai', content: '', streaming: true },
    ])
    setIsStreaming(true)
    setError(null)

    try {
      await streamChatMessage(
        { message: query, propertyId, threadId: null, metadata: { intent: 'document_query' } },
        (event) => {
          if (event.type === 'token') {
            setMessages(prev =>
              prev.map(m => m.id === aiId ? { ...m, content: m.content + event.content } : m)
            )
          } else if (event.type === 'result' && event.sources?.length) {
            const sources = event.sources.map(mapSourceChunk)
            setMessages(prev =>
              prev.map(m => m.id === aiId ? { ...m, sources } : m)
            )
          } else if (event.type === 'error') {
            setMessages(prev =>
              prev.map(m => m.id === aiId ? { ...m, content: event.message } : m)
            )
          }
        },
      )
    } catch {
      setError('Search failed. Please try again.')
      setMessages(prev => prev.filter(m => m.id !== aiId))
    } finally {
      setMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, streaming: false } : m)
      )
      setIsStreaming(false)
    }
  }, [isStreaming, propertyId])

  return { messages, isLoading: isStreaming, error, search }
}
