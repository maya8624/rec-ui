import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { generateEnquiryDraft, sendEnquiryReply } from '../api/agentApi'
import { useEnquiryDraft } from './useEnquiryDraft'
import type { Enquiry } from '../types/agent'

vi.mock('../api/agentApi', () => ({
  generateEnquiryDraft: vi.fn(),
  sendEnquiryReply: vi.fn(),
}))

function makeEnquiry(overrides: Partial<Enquiry> = {}): Enquiry {
  return {
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
    ...overrides,
  }
}

const mockGeneratedDraft = { draft: 'Dear Sarah, thank you for contacting us.', sources: ['Lease agreement · Clause 14.2'], status: 'Drafted' }

describe('useEnquiryDraft', () => {
  beforeEach(() => { vi.clearAllMocks() })

  describe('null enquiry', () => {
    it('returns null draft, not loading, no error', () => {
      const { result } = renderHook(() => useEnquiryDraft(null))
      expect(result.current.draft).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('does not call generateEnquiryDraft', () => {
      renderHook(() => useEnquiryDraft(null))
      expect(generateEnquiryDraft).not.toHaveBeenCalled()
    })
  })

  describe('sentReply present', () => {
    it('uses sentReply as draft without calling the API', async () => {
      const enquiry = makeEnquiry({ sentReply: 'Sent reply text', status: 'replied' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      expect(result.current.draft?.draft).toBe('Sent reply text')
      expect(generateEnquiryDraft).not.toHaveBeenCalled()
    })

    it('returns empty sources for sentReply', async () => {
      const enquiry = makeEnquiry({ sentReply: 'Sent reply text', status: 'replied' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      expect(result.current.draft?.sources).toEqual([])
    })
  })

  describe('draftReply present, no sentReply', () => {
    it('uses draftReply as draft without calling the API', async () => {
      const enquiry = makeEnquiry({ draftReply: 'AI drafted reply', status: 'drafted' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      expect(result.current.draft?.draft).toBe('AI drafted reply')
      expect(generateEnquiryDraft).not.toHaveBeenCalled()
    })

    it('returns empty sources for draftReply', async () => {
      const enquiry = makeEnquiry({ draftReply: 'AI drafted reply', status: 'drafted' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      expect(result.current.draft?.sources).toEqual([])
    })
  })

  describe('new enquiry — no draft, no sentReply', () => {
    it('sets isLoading true immediately', () => {
      ;(generateEnquiryDraft as Mock).mockReturnValue(new Promise(() => {}))
      const enquiry = makeEnquiry({ status: 'new' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      expect(result.current.isLoading).toBe(true)
    })

    it('calls generateEnquiryDraft with the enquiry id', async () => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      const enquiry = makeEnquiry({ id: 'enq-abc', status: 'new' })
      renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      expect(generateEnquiryDraft).toHaveBeenCalledWith({ id: 'enq-abc' })
    })

    it('sets draft and clears isLoading on success', async () => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      const enquiry = makeEnquiry({ status: 'new' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      expect(result.current.draft).toEqual(mockGeneratedDraft)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('sets error message and clears isLoading on failure', async () => {
      ;(generateEnquiryDraft as Mock).mockRejectedValue(new Error('Server error'))
      const enquiry = makeEnquiry({ status: 'new' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      expect(result.current.error).toBe('Failed to generate draft reply.')
      expect(result.current.isLoading).toBe(false)
      expect(result.current.draft).toBeNull()
    })
  })

  describe('onStatusChange callback', () => {
    it('calls onStatusChange with id and mapped status after draft generation', async () => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      const onStatusChange = vi.fn()
      const enquiry = makeEnquiry({ id: 'enq-abc', status: 'new' })
      renderHook(() => useEnquiryDraft(enquiry, onStatusChange))
      await act(async () => {})
      expect(onStatusChange).toHaveBeenCalledWith('enq-abc', 'drafted')
    })

    it('does not call onStatusChange when draft comes from sentReply or draftReply', async () => {
      const onStatusChange = vi.fn()
      const enquiry = makeEnquiry({ draftReply: 'Stored draft', status: 'drafted' })
      renderHook(() => useEnquiryDraft(enquiry, onStatusChange))
      await act(async () => {})
      expect(onStatusChange).not.toHaveBeenCalled()
    })

    it('does not call onStatusChange when generation fails', async () => {
      ;(generateEnquiryDraft as Mock).mockRejectedValue(new Error('boom'))
      const onStatusChange = vi.fn()
      const enquiry = makeEnquiry({ status: 'new' })
      renderHook(() => useEnquiryDraft(enquiry, onStatusChange))
      await act(async () => {})
      expect(onStatusChange).not.toHaveBeenCalled()
    })
  })

  describe('isReadOnly', () => {
    it.each(['replied', 'closed'] as const)('is true for status "%s"', (status) => {
      const enquiry = makeEnquiry({ status, sentReply: 'Sent text' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      expect(result.current.isReadOnly).toBe(true)
    })

    it.each(['drafted', 'replied', 'closed'] as const)(
      'does not call generateEnquiryDraft for status "%s" even when sentReply and draftReply are null',
      async (status) => {
        const enquiry = makeEnquiry({ status, sentReply: null, draftReply: null })
        const { result } = renderHook(() => useEnquiryDraft(enquiry))
        await act(async () => {})
        expect(generateEnquiryDraft).not.toHaveBeenCalled()
        expect(result.current.isLoading).toBe(false)
        expect(result.current.draft).toBeNull()
      },
    )

    it.each(['new', 'drafted'] as const)('is false for status "%s"', (status) => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      const enquiry = makeEnquiry({ status })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      expect(result.current.isReadOnly).toBe(false)
    })
  })

  describe('send', () => {
    it('sets isSending true while in-flight', () => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      ;(sendEnquiryReply as Mock).mockReturnValue(new Promise(() => {}))
      const enquiry = makeEnquiry({ status: 'new', draftReply: 'Draft text' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      act(() => { void result.current.send() })
      expect(result.current.isSending).toBe(true)
    })

    it('calls POST /enquiries/{id}/send with the enquiry id', async () => {
      ;(sendEnquiryReply as Mock).mockResolvedValue({ sentReply: 'Sent text', repliedAtUtc: '2025-05-16T10:00:00Z' })
      const enquiry = makeEnquiry({ status: 'new', draftReply: 'Draft text' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => { await result.current.send() })
      expect(sendEnquiryReply).toHaveBeenCalledWith('enq-1')
    })

    it('updates draft with sentReply and calls onStatusChange with replied', async () => {
      const sendResponse = { sentReply: 'Sent text', repliedAtUtc: '2025-05-16T10:00:00Z' }
      ;(sendEnquiryReply as Mock).mockResolvedValue(sendResponse)
      const onStatusChange = vi.fn()
      const enquiry = makeEnquiry({ status: 'new', draftReply: 'Draft text' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry, onStatusChange))
      await act(async () => { await result.current.send() })
      expect(result.current.draft?.draft).toBe('Sent text')
      expect(result.current.isSending).toBe(false)
      expect(onStatusChange).toHaveBeenCalledWith('enq-1', 'replied')
    })

    it('sets sendError and clears isSending on failure', async () => {
      ;(sendEnquiryReply as Mock).mockRejectedValue(new Error('Network error'))
      const enquiry = makeEnquiry({ status: 'new', draftReply: 'Draft text' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => { await result.current.send() })
      expect(result.current.sendError).toBe('Failed to send reply. Please try again.')
      expect(result.current.isSending).toBe(false)
    })

    it('does nothing when isReadOnly', async () => {
      const enquiry = makeEnquiry({ status: 'replied', sentReply: 'Already sent' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => { await result.current.send() })
      expect(sendEnquiryReply).not.toHaveBeenCalled()
    })
  })

  describe('refetch', () => {
    it('re-calls generateEnquiryDraft and updates draft', async () => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      const enquiry = makeEnquiry({ status: 'new' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})

      const regenerated = { draft: 'Regenerated reply', sources: [], status: 'Drafted' }
      ;(generateEnquiryDraft as Mock).mockResolvedValue(regenerated)
      await act(async () => { result.current.refetch() })

      expect(generateEnquiryDraft).toHaveBeenCalledTimes(2)
      expect(result.current.draft).toEqual(regenerated)
    })

    it('does not call generateEnquiryDraft when isReadOnly', async () => {
      const enquiry = makeEnquiry({ status: 'replied', sentReply: 'Sent text' })
      const { result } = renderHook(() => useEnquiryDraft(enquiry))
      await act(async () => {})
      await act(async () => { result.current.refetch() })
      expect(generateEnquiryDraft).not.toHaveBeenCalled()
    })
  })

  describe('switching enquiries', () => {
    it('re-fetches when enquiry id changes', async () => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      const enquiry1 = makeEnquiry({ id: 'enq-1', status: 'new' })
      const { rerender } = renderHook((enq: Enquiry | null) => useEnquiryDraft(enq), {
        initialProps: enquiry1 as Enquiry | null,
      })
      await act(async () => {})
      expect(generateEnquiryDraft).toHaveBeenCalledTimes(1)

      const enquiry2 = makeEnquiry({ id: 'enq-2', status: 'new' })
      rerender(enquiry2)
      await act(async () => {})
      expect(generateEnquiryDraft).toHaveBeenCalledTimes(2)
      expect(generateEnquiryDraft).toHaveBeenLastCalledWith({ id: 'enq-2' })
    })

    it('clears draft and error when enquiry becomes null', async () => {
      ;(generateEnquiryDraft as Mock).mockResolvedValue(mockGeneratedDraft)
      const enquiry = makeEnquiry({ status: 'new' })
      const { result, rerender } = renderHook((enq: Enquiry | null) => useEnquiryDraft(enq), {
        initialProps: enquiry as Enquiry | null,
      })
      await act(async () => {})
      expect(result.current.draft).not.toBeNull()

      rerender(null)
      expect(result.current.draft).toBeNull()
      expect(result.current.error).toBeNull()
    })
  })
})
