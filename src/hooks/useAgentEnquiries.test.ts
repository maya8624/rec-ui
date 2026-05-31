import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { fetchAgentEnquiries } from '../api/agentApi'
import { useAgentEnquiries } from './useAgentEnquiries'
import type { Enquiry } from '../types/agent'

vi.mock('../api/agentApi', () => ({ fetchAgentEnquiries: vi.fn() }))

const mockEnquiries: Enquiry[] = [
  {
    id: 'enq-1',
    senderName: 'Sarah Chen',
    senderEmail: 'sarah@example.com',
    preview: 'I have a question',
    message: 'I have a question about the water bill.',
    timestamp: '2025-05-16T09:23:00Z',
    status: 'new',
    propertyId: 'prop-1',
    draftReply: null,
    draftSources: [],
    sentReply: null,
  },
  {
    id: 'enq-2',
    senderName: 'James Okafor',
    senderEmail: 'james@example.com',
    preview: 'When is the inspection?',
    message: 'When is the inspection scheduled?',
    timestamp: '2025-05-15T14:10:00Z',
    status: 'drafted',
    propertyId: 'prop-2',
    draftReply: 'Dear James, the inspection is on...',
    draftSources: [],
    sentReply: null,
  },
]

describe('useAgentEnquiries', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('starts with empty enquiries and no error', () => {
    ;(fetchAgentEnquiries as Mock).mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useAgentEnquiries())
    expect(result.current.enquiries).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('sets isLoading true while fetching', () => {
    ;(fetchAgentEnquiries as Mock).mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useAgentEnquiries())
    expect(result.current.isLoading).toBe(true)
  })

  it('calls fetchAgentEnquiries on mount', () => {
    ;(fetchAgentEnquiries as Mock).mockResolvedValue([])
    renderHook(() => useAgentEnquiries())
    expect(fetchAgentEnquiries).toHaveBeenCalledTimes(1)
  })

  it('populates enquiries and clears loading on success', async () => {
    ;(fetchAgentEnquiries as Mock).mockResolvedValue(mockEnquiries)
    const { result } = renderHook(() => useAgentEnquiries())
    await act(async () => {})
    expect(result.current.enquiries).toEqual(mockEnquiries)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error message and clears loading on failure', async () => {
    ;(fetchAgentEnquiries as Mock).mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useAgentEnquiries())
    await act(async () => {})
    expect(result.current.error).toBe('Failed to load enquiries.')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.enquiries).toEqual([])
  })

  it('refetch re-calls fetchAgentEnquiries', async () => {
    ;(fetchAgentEnquiries as Mock).mockResolvedValue(mockEnquiries)
    const { result } = renderHook(() => useAgentEnquiries())
    await act(async () => {})
    expect(fetchAgentEnquiries).toHaveBeenCalledTimes(1)

    await act(async () => { result.current.refetch() })
    expect(fetchAgentEnquiries).toHaveBeenCalledTimes(2)
  })

  it('refetch clears a previous error and reloads', async () => {
    ;(fetchAgentEnquiries as Mock).mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useAgentEnquiries())
    await act(async () => {})
    expect(result.current.error).not.toBeNull()

    ;(fetchAgentEnquiries as Mock).mockResolvedValue(mockEnquiries)
    await act(async () => { result.current.refetch() })
    expect(result.current.error).toBeNull()
    expect(result.current.enquiries).toEqual(mockEnquiries)
  })
})
