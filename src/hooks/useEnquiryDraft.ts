import { useState, useEffect } from 'react'
import { generateEnquiryDraft, sendEnquiryReply } from '../api/agentApi'
import type { Enquiry, EnquiryDraft, EnquiryStatus } from '../types/agent'

export interface UseEnquiryDraftReturn {
  draft: EnquiryDraft | null
  isLoading: boolean
  error: string | null
  isReadOnly: boolean
  isSending: boolean
  sendError: string | null
  refetch: () => void
  send: () => void
}

const STATUS_MAP: Record<string, EnquiryStatus> = {
  new: 'new', drafted: 'drafted', replied: 'replied', closed: 'closed',
  '1': 'new', '2': 'drafted', '3': 'replied', '4': 'closed',
}

export function useEnquiryDraft(
  enquiry: Enquiry | null,
  onStatusChange?: (id: string, status: EnquiryStatus) => void,
): UseEnquiryDraftReturn {
  const [draft, setDraft] = useState<EnquiryDraft | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  function generate(enq: Enquiry) {
    setIsLoading(true)
    setError(null)
    generateEnquiryDraft({ id: enq.id })
      .then(data => {
        setDraft(data)
        const mapped = STATUS_MAP[data.status?.toLowerCase()] ?? 'drafted'
        onStatusChange?.(enq.id, mapped)
      })
      .catch(() => setError('Something went wrong. Please try again.'))
      .finally(() => setIsLoading(false))
  }

  async function send() {
    if (!enquiry || isReadOnly || isSending) return
    setIsSending(true)
    setSendError(null)
    try {
      const data = await sendEnquiryReply(enquiry.id)
      setDraft({ draft: data.sentReply, sources: [], status: 'Replied' })
      onStatusChange?.(enquiry.id, 'replied')
    } catch {
      setSendError('Failed to send reply. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (!enquiry) {
      setDraft(null)
      setError(null)
      setSendError(null)
      return
    }

    setDraft(null)
    setError(null)
    setSendError(null)

    // sentReply → already sent, show read-only
    if (enquiry.sentReply) {
      setDraft({ draft: enquiry.sentReply, sources: enquiry.draftSources, status: 'Replied' })
      return
    }

    // draftReply → show editable draft (no API call)
    if (enquiry.draftReply) {
      setDraft({ draft: enquiry.draftReply, sources: enquiry.draftSources, status: 'Drafted' })
      return
    }

    // drafted / replied / closed → nothing to generate
    if (enquiry.status === 'drafted' || enquiry.status === 'replied' || enquiry.status === 'closed') return

    // new enquiry with no draft → generate via AI
    generate(enquiry)
  }, [enquiry?.id])

  const isReadOnly = enquiry?.status === 'replied' || enquiry?.status === 'closed'

  return {
    draft,
    isLoading,
    error,
    isReadOnly,
    isSending,
    sendError,
    refetch: () => { if (enquiry && !isReadOnly) generate(enquiry) },
    send,
  }
}
