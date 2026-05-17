import { useState, useCallback } from 'react'
import { searchDocuments } from '../api/agentApi'
import { initialDocMessages } from '../data/agent/demoData'
import type { DocMessage } from '../types/agent'

export function useDocumentSearch() {
  const [messages, setMessages] = useState<DocMessage[]>(initialDocMessages)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string) => {
    if (isSearching || !query.trim()) return
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'user', content: query }])
    setIsSearching(true)
    setError(null)
    try {
      const res = await searchDocuments(query)
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: 'ai', content: res.answer, sourceNodes: res.source_nodes },
      ])
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }, [isSearching])

  return { messages, isSearching, error, search }
}
