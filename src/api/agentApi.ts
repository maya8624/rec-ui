import { api } from '../services/apiClient'
import type {
  ApiEnquiry,
  ApiEnquiryDraft,
  Enquiry,
  EnquiryAiRequest,
  EnquiryDraft,
  EnquiryStatus,
  EnquirySendResponse,
  IndexedDocument,
  UploadedFile,
} from '../types/agent'

export function mapSourceChunk(raw: { fileName?: string; file_name?: string; page: number | null; score: number; text: string }) {
  return {
    fileName: raw.fileName ?? raw.file_name ?? '',
    page: raw.page,
    score: raw.score,
    text: raw.text,
  }
}

const STATUS_MAP: Record<string, EnquiryStatus> = {
  // string enum (JsonStringEnumConverter)
  new: 'new',
  drafted: 'drafted',
  replied: 'replied',
  closed: 'closed',
  // integer enum fallback
  '1': 'new',
  '2': 'drafted',
  '3': 'replied',
  '4': 'closed',
}

function mapEnquiry(e: ApiEnquiry): Enquiry {
  return {
    id: e.id,
    senderName: e.senderName,
    senderEmail: e.senderEmail,
    preview: e.body.slice(0, 80),
    message: e.body,
    timestamp: e.createdAtUtc,
    status: STATUS_MAP[String(e.status).toLowerCase()] ?? 'new',
    propertyId: e.propertyId,
    draftReply: e.draftReply,
    draftSources: (e.draftSources ?? []).map(mapSourceChunk),
    sentReply: e.sentReply,
  }
}

// GET /enquiries/agent — agent_id resolved server-side from JWT
export async function fetchAgentEnquiries(): Promise<Enquiry[]> {
  const { data } = await api.get<ApiEnquiry[]>('/enquiries/agent')
  return data.map(mapEnquiry)
}

// POST /ai/enquiry-draft — called when an enquiry is selected (no existing draft)
export async function generateEnquiryDraft(req: EnquiryAiRequest): Promise<EnquiryDraft> {
  const { data } = await api.post<ApiEnquiryDraft>('/ai/enquiry-draft', req)
  return { draft: data.draft, sources: (data.sources ?? []).map(mapSourceChunk), status: data.status }
}

// POST /enquiries/{id}/send — sends the stored draft reply
export async function sendEnquiryReply(id: string): Promise<EnquirySendResponse> {
  const { data } = await api.post<EnquirySendResponse>(`/enquiries/${id}/send`)
  return data
}

export async function fetchDocuments(): Promise<IndexedDocument[]> {
  const { data } = await api.get<IndexedDocument[]>('/agent/documents')
  return data
}

export async function uploadDocument(file: File): Promise<{ id: string }> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<{ id: string }>('/agent/documents/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function fetchUploadStatus(id: string): Promise<UploadedFile> {
  const { data } = await api.get<UploadedFile>(`/agent/documents/upload-status/${id}`)
  return data
}
