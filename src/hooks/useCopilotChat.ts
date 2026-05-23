import { useState } from 'react'
import { actionResponses, streamMessage } from '../data/copilot/demoData'
import { streamChatMessage } from '../api/chatApi'
import type { ChatRequest } from '../types/chat'
import type { CopilotMessage, ListingItem, SuburbSummaryResponse } from '../types/copilot'

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

  async function handleSendStructured(userText: string, suburbSummary: SuburbSummaryResponse) {
    if (isStreaming) return
    const userMsg: CopilotMessage = { id: crypto.randomUUID(), role: 'user', text: userText }
    const aiId = crypto.randomUUID()
    const aiMsg: CopilotMessage = {
      id: aiId,
      role: 'ai',
      text: '',
      type: 'suburb-summary',
      suburbSummary,
      streaming: true,
    }
    setMessages(prev => [...prev, userMsg, aiMsg])
    setIsStreaming(true)
    await new Promise(r => setTimeout(r, 800))
    setMessages(prev => prev.map(m => (m.id === aiId ? { ...m, streaming: false } : m)))
    setIsStreaming(false)
  }

  async function handleStreamFromApi(
    userText: string,
    payload: ChatRequest,
    onListings: (listings: ListingItem[]) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    if (isStreaming) return
    const userMsg: CopilotMessage = { id: crypto.randomUUID(), role: 'user', text: userText }
    const aiId = crypto.randomUUID()
    const aiMsg: CopilotMessage = { id: aiId, role: 'ai', text: '', streaming: true }
    setMessages(prev => [...prev, userMsg, aiMsg])
    setIsStreaming(true)

    try {
      await streamChatMessage(
        payload,
        (event) => {
          if (event.type === 'token') {
            setMessages(prev =>
              prev.map(m => m.id === aiId ? { ...m, text: m.text + event.content } : m)
            )
          } else if (event.type === 'result') {
            const listings: ListingItem[] = event.listings.map(l => ({
              propertyId: l.property_id,
              listingId: l.listing_id,
              listingType: l.listing_type,
              listingStatus: l.listing_status,
              price: l.price,
              bedrooms: l.bedrooms,
              bathrooms: l.bathrooms,
              carSpaces: l.car_spaces,
              petFriendly: l.pet_friendly,
              propertyType: l.property_type,
              address: l.address,
              suburb: l.suburb,
              state: l.state,
              postcode: l.postcode,
              agentName: l.agent_name,
              agentPhone: l.agent_phone,
              agencyName: l.agency_name,
              propertyUrl: l.property_url,
              imageUrl: l.image_url,
            }))
            onListings(listings)
            setMessages(prev =>
              prev.map(m => m.id === aiId ? { ...m, listings } : m)
            )
          } else if (event.type === 'error') {
            setMessages(prev =>
              prev.map(m => m.id === aiId ? { ...m, text: event.message } : m)
            )
          }
        },
        signal,
      )
    } catch {
      setMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, text: 'Failed to load results. Please try again.' } : m)
      )
    } finally {
      setMessages(prev =>
        prev.map(m => m.id === aiId ? { ...m, streaming: false } : m)
      )
      setIsStreaming(false)
    }
  }

  function addAiMessage(text: string) {
    setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'ai', text }])
  }

  return { messages, isStreaming, handleSend, handleAction, handleSendStructured, handleStreamFromApi, addAiMessage }
}
