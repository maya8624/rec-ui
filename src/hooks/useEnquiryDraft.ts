import { useState, useEffect } from 'react'
import { fetchEnquiryDraft } from '../api/agentApi'
import type { EnquiryDraft } from '../types/agent'

export interface UseEnquiryDraftReturn {
  draft: EnquiryDraft | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useEnquiryDraft(enquiryId: string | null): UseEnquiryDraftReturn {
  const [draft, setDraft] = useState<EnquiryDraft | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load(id: string) {
    setIsLoading(true)
    setError(null)
    fetchEnquiryDraft(id)
      .then(setDraft)
      .catch(() => setError('Failed to load draft reply.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (!enquiryId) { setDraft(null); return }
    load(enquiryId)
  }, [enquiryId])

  return {
    draft,
    isLoading,
    error,
    refetch: () => { if (enquiryId) load(enquiryId) },
  }
}
