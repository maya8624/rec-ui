import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { fetchAgentEnquiries, generateEnquiryDraft } from './agentApi'
import { api } from '../services/apiClient'
import type { ApiEnquiry } from '../types/agent'

vi.mock('../services/apiClient', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}))

const baseApiEnquiry: ApiEnquiry = {
  id: 'enq-abc',
  propertyId: 'prop-123',
  listingId: null,
  agentId: 'agent-456',
  body: 'I have a question about the water bill.',
  draftReply: null,
  draftSources: [],
  sentReply: null,
  status: 'New',
  senderName: 'Sarah Chen',
  senderEmail: 'sarah@example.com',
  createdAtUtc: '2025-05-16T09:23:00Z',
  repliedAtUtc: null,
}

describe('fetchAgentEnquiries', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls GET /enquiry/agent', async () => {
    ;(api.get as Mock).mockResolvedValue({ data: [] })
    await fetchAgentEnquiries()
    expect(api.get).toHaveBeenCalledWith('/enquiries/agent')
  })

  it('maps core fields correctly', async () => {
    ;(api.get as Mock).mockResolvedValue({ data: [baseApiEnquiry] })
    const [enq] = await fetchAgentEnquiries()
    expect(enq.id).toBe('enq-abc')
    expect(enq.message).toBe('I have a question about the water bill.')
    expect(enq.propertyId).toBe('prop-123')
    expect(enq.timestamp).toBe('2025-05-16T09:23:00Z')
    expect(enq.senderName).toBe('Sarah Chen')
    expect(enq.senderEmail).toBe('sarah@example.com')
    expect(enq.draftReply).toBeNull()
    expect(enq.sentReply).toBeNull()
  })

  it('derives preview from first 80 chars of body', async () => {
    const longBody = 'A'.repeat(100)
    ;(api.get as Mock).mockResolvedValue({ data: [{ ...baseApiEnquiry, body: longBody }] })
    const [enq] = await fetchAgentEnquiries()
    expect(enq.preview).toBe('A'.repeat(80))
    expect(enq.message).toBe(longBody)
  })

  it('keeps preview equal to body when body is shorter than 80 chars', async () => {
    ;(api.get as Mock).mockResolvedValue({ data: [baseApiEnquiry] })
    const [enq] = await fetchAgentEnquiries()
    expect(enq.preview).toBe(enq.message)
  })

  it('passes through null senderName and senderEmail', async () => {
    ;(api.get as Mock).mockResolvedValue({
      data: [{ ...baseApiEnquiry, senderName: null, senderEmail: null }],
    })
    const [enq] = await fetchAgentEnquiries()
    expect(enq.senderName).toBeNull()
    expect(enq.senderEmail).toBeNull()
  })

  describe('status mapping — string enum', () => {
    it.each([
      ['New', 'new'],
      ['Drafted', 'drafted'],
      ['Replied', 'replied'],
      ['Closed', 'closed'],
      ['NEW', 'new'],           // case-insensitive
      ['DRAFTED', 'drafted'],
    ])('maps status %s → %s', async (apiStatus, expected) => {
      ;(api.get as Mock).mockResolvedValue({
        data: [{ ...baseApiEnquiry, status: apiStatus }],
      })
      const [enq] = await fetchAgentEnquiries()
      expect(enq.status).toBe(expected)
    })
  })

  describe('status mapping — integer enum', () => {
    it.each([
      [1, 'new'],
      [2, 'drafted'],
      [3, 'replied'],
      [4, 'closed'],
    ])('maps status %d → %s', async (apiStatus, expected) => {
      ;(api.get as Mock).mockResolvedValue({
        data: [{ ...baseApiEnquiry, status: apiStatus }],
      })
      const [enq] = await fetchAgentEnquiries()
      expect(enq.status).toBe(expected)
    })
  })

  it('falls back to "new" for unknown status', async () => {
    ;(api.get as Mock).mockResolvedValue({
      data: [{ ...baseApiEnquiry, status: 'unknown_status' }],
    })
    const [enq] = await fetchAgentEnquiries()
    expect(enq.status).toBe('new')
  })

  it('maps draftReply and sentReply when present', async () => {
    ;(api.get as Mock).mockResolvedValue({
      data: [{ ...baseApiEnquiry, draftReply: 'Draft text', sentReply: 'Sent text' }],
    })
    const [enq] = await fetchAgentEnquiries()
    expect(enq.draftReply).toBe('Draft text')
    expect(enq.sentReply).toBe('Sent text')
  })

  it('returns empty array when response is empty', async () => {
    ;(api.get as Mock).mockResolvedValue({ data: [] })
    const result = await fetchAgentEnquiries()
    expect(result).toEqual([])
  })

  it('propagates API errors', async () => {
    ;(api.get as Mock).mockRejectedValue(new Error('Network error'))
    await expect(fetchAgentEnquiries()).rejects.toThrow('Network error')
  })
})

describe('generateEnquiryDraft', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls POST /ai/enquiry-draft with the enquiry id', async () => {
    const mockApiDraft = { draft: 'Generated reply', sources: [], status: 'Drafted' }
    ;(api.post as Mock).mockResolvedValue({ data: mockApiDraft })

    const result = await generateEnquiryDraft({ id: 'enq-abc' })

    expect(api.post).toHaveBeenCalledWith('/ai/enquiry-draft', { id: 'enq-abc' })
    expect(result).toEqual({ draft: 'Generated reply', sources: [], status: 'Drafted' })
  })

  it('propagates API errors', async () => {
    ;(api.post as Mock).mockRejectedValue(new Error('Server error'))
    await expect(generateEnquiryDraft({ id: 'enq-abc' })).rejects.toThrow('Server error')
  })
})
