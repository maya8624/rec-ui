import { useState, useEffect } from 'react'
import { fetchAgentEnquiries } from '../api/agentApi'
import type { Enquiry, EnquiryStatus } from '../types/agent'

export interface UseAgentEnquiriesReturn {
  enquiries: Enquiry[]
  isLoading: boolean
  error: string | null
  refetch: () => void
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void
}

export function useAgentEnquiries(): UseAgentEnquiriesReturn {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function load() {
    setIsLoading(true)
    setError(null)
    fetchAgentEnquiries()
      .then(setEnquiries)
      .catch(() => setError('Failed to load enquiries.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load() }, [])

  function updateEnquiryStatus(id: string, status: EnquiryStatus) {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e))
  }

  return { enquiries, isLoading, error, refetch: load, updateEnquiryStatus }
}
