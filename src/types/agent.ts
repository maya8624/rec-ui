export type AgentTab = 'enquiry' | 'documents' | 'upload'

export type EnquiryStatus = 'new' | 'drafted' | 'replied' | 'closed'

export interface SourceChunk {
  fileName: string
  page: number | null
  score: number
  text: string
}

// Raw shape from GET /enquiry/agent
export interface ApiEnquiry {
  id: string
  propertyId: string
  listingId: string | null
  agentId: string
  body: string
  draftReply: string | null
  draftSources: SourceChunk[]
  sentReply: string | null
  status: string
  senderName: string | null
  senderEmail: string | null
  createdAtUtc: string
  repliedAtUtc: string | null
}

// UI model
export interface Enquiry {
  id: string
  senderName: string | null
  senderEmail: string | null
  preview: string
  message: string
  timestamp: string
  status: EnquiryStatus
  propertyId: string
  draftReply: string | null
  draftSources: SourceChunk[]
  sentReply: string | null
}

export interface EnquiryAiRequest {
  id: string
}

export interface EnquirySendResponse {
  sentReply: string
  repliedAtUtc: string
}

// Raw shape from POST /ai/enquiry-draft
export interface ApiEnquiryDraft {
  draft: string
  draftSources: SourceChunk[]
  status: string
}

// Internal UI model — sources normalised from ApiEnquiryDraft.draftSources
export interface EnquiryDraft {
  draft: string
  sources: SourceChunk[]
  status: string
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

export interface DocMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  sources?: SourceChunk[]
  streaming?: boolean
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
