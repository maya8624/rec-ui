// Toggle between mock data and real API.
// When false, set VITE_API_BASE_URL to the Python/FastAPI backend (default: http://localhost:8000/api).
export const USE_MOCK = true

import { api } from '../services/apiClient'
import {
  enquiryDraftResponse,
  indexedDocuments,
  initialDocMessages,
  recentUploads,
} from '../data/agent/demoData'
import type { EnquiryDraft, IndexedDocument, DocSearchResponse, UploadedFile } from '../types/agent'

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export async function fetchEnquiryDraft(enquiryId: string): Promise<EnquiryDraft> {
  if (USE_MOCK) {
    await delay(800)
    void enquiryId
    return { ...enquiryDraftResponse }
  }
  const { data } = await api.post<EnquiryDraft>(`/agent/enquiries/${enquiryId}/draft`)
  return data
}

export async function fetchDocuments(): Promise<IndexedDocument[]> {
  if (USE_MOCK) {
    await delay(400)
    return [...indexedDocuments]
  }
  const { data } = await api.get<IndexedDocument[]>('/agent/documents')
  return data
}

export async function searchDocuments(query: string): Promise<DocSearchResponse> {
  if (USE_MOCK) {
    await delay(1200)
    const seed = initialDocMessages.find(m => m.role === 'ai')
    return {
      answer: `Regarding "${query}": ${seed?.content ?? 'No information found.'}`,
      source_nodes: seed?.sourceNodes ?? [],
    }
  }
  const { data } = await api.post<DocSearchResponse>('/agent/documents/search', { query })
  return data
}

export async function uploadDocument(file: File): Promise<{ id: string }> {
  if (USE_MOCK) {
    await delay(1000)
    void file
    return { id: `up-${Date.now()}` }
  }
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<{ id: string }>('/agent/documents/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function fetchUploadStatus(id: string): Promise<UploadedFile> {
  if (USE_MOCK) {
    await delay(500)
    return (
      recentUploads.find(u => u.id === id) ?? {
        id,
        filename: 'unknown',
        sizeMb: 0,
        status: 'processing' as const,
        uploadedAt: new Date().toISOString(),
      }
    )
  }
  const { data } = await api.get<UploadedFile>(`/agent/documents/upload-status/${id}`)
  return data
}
