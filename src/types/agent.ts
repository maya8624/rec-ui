export type AgentTab = 'enquiry' | 'documents' | 'upload'

export type EnquiryStatus = 'new' | 'replied' | 'pending'

export interface Enquiry {
  id: string
  sender: string
  email: string
  preview: string
  message: string
  timestamp: string
  status: EnquiryStatus
}

export interface EnquiryDraft {
  draft: string
  context_sources: string[]
}

export type DocType = 'pdf' | 'docx' | 'txt'

export interface IndexedDocument {
  id: string
  name: string
  type: DocType
  chunks: number
}

export interface RagContextInfo {
  embedModel: string
  indexType: string
  tenant: string
}

export interface SourceNode {
  source: string
  page: number
  score: number
  text: string
  type: DocType
}

export interface DocSearchResponse {
  answer: string
  source_nodes: SourceNode[]
}

export interface DocMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  sourceNodes?: SourceNode[]
}

export type UploadStatus = 'indexed' | 'processing' | 'error'

export interface UploadedFile {
  id: string
  filename: string
  sizeMb: number
  status: UploadStatus
  uploadedAt: string
}

export interface AgentWorkflowStep {
  label: string
  status: 'done' | 'active' | 'waiting'
  detail?: string
}
