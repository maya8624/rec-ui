import type {
  Enquiry,
  EnquiryDraft,
  IndexedDocument,
  RagContextInfo,
  DocMessage,
  UploadedFile,
  AgentWorkflowStep,
} from '../../types/agent'

export const enquiries: Enquiry[] = [
  {
    id: 'enq-1',
    sender: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    preview: 'Hi, I wanted to ask about the water bill for Q1…',
    message:
      "Hi, I wanted to ask about the water bill for Q1. I received a notice saying I owe $340 but my lease says water is included in the rent. Could you please clarify? I moved in on 1 Feb and this is the first bill I've seen.",
    timestamp: '2025-05-16T09:23:00Z',
    status: 'new',
  },
  {
    id: 'enq-2',
    sender: 'James Okafor',
    email: 'j.okafor@email.com',
    preview: 'When is the inspection scheduled for my property?',
    message:
      "Hi there, I received a notice about an upcoming inspection but I'm not sure of the exact date. Could you confirm when it's scheduled? I work from home so I'd appreciate as much notice as possible.",
    timestamp: '2025-05-15T14:10:00Z',
    status: 'pending',
  },
  {
    id: 'enq-3',
    sender: 'Mei Lin',
    email: 'mei.lin@rentals.com',
    preview: 'Re: Lease renewal for 12 Campbell Parade',
    message:
      "Thanks for sending through the renewal terms. We're happy to proceed with a 12-month extension at the current rent. Please send through the paperwork at your earliest convenience.",
    timestamp: '2025-05-14T11:45:00Z',
    status: 'replied',
  },
]

export const enquiryDraftResponse: EnquiryDraft = {
  draft: `Dear Sarah,\n\nThank you for reaching out. I've reviewed your tenancy agreement for 12 Campbell Parade and can confirm that water charges are included in your weekly rent.\n\nThe Q1 water bill you received relates to excess usage above the standard 150L/day allowance. Our records show usage of 48,200L against an allowance of 45,000L for Q1, resulting in the excess charge of $340.\n\nI'm happy to discuss this further or arrange a call if you'd like to go through the numbers together.\n\nKind regards,\nHarbour Realty Group`,
  context_sources: [
    'Residential Tenancy Agreement — 12 Campbell Pde · Clause 14.2',
    'Water Bill Q1 2025 — Bondi Beach',
  ],
}

export const indexedDocuments: IndexedDocument[] = [
  { id: 'doc-1', name: 'Residential Tenancy Agreement — 12 Campbell Pde', type: 'pdf', chunks: 42 },
  { id: 'doc-2', name: 'Water Bill Q1 2025 — Bondi Beach', type: 'pdf', chunks: 8 },
  { id: 'doc-3', name: 'Property Inspection Report — Feb 2025', type: 'docx', chunks: 19 },
  { id: 'doc-4', name: 'Harbour Realty Agency Disclosure', type: 'pdf', chunks: 11 },
  { id: 'doc-5', name: 'Tenant Rights NSW Summary', type: 'txt', chunks: 6 },
]

export const ragContextInfo: RagContextInfo = {
  embedModel: 'text-embedding-3-small',
  indexType: 'pgvector · HNSW',
  tenant: 'harbour-realty',
}

export const initialDocMessages: DocMessage[] = [
  {
    id: 'dmsg-1',
    role: 'user',
    content: 'Is water included in the rent for 12 Campbell Parade?',
  },
  {
    id: 'dmsg-2',
    role: 'ai',
    content:
      'Yes, according to the tenancy agreement for 12 Campbell Parade, water usage charges are included in the weekly rent of $920. The landlord is responsible for water supply costs, though the tenant is liable for excess usage above the standard 150L/day allowance.',
    sourceNodes: [
      {
        source: 'Residential Tenancy Agreement — 12 Campbell Pde',
        page: 4,
        score: 0.94,
        text: 'Water charges are included in the agreed weekly rent. Tenant liability applies for usage exceeding 150L/day per person.',
        type: 'pdf',
      },
      {
        source: 'Water Bill Q1 2025 — Bondi Beach',
        page: 1,
        score: 0.81,
        text: 'Q1 2025 water usage: 48,200L. Standard allowance: 45,000L. Excess: 3,200L at $0.106/L.',
        type: 'pdf',
      },
    ],
  },
]

export const recentUploads: UploadedFile[] = [
  { id: 'up-1', filename: 'lease_renewal_2025.pdf', sizeMb: 1.2, status: 'indexed', uploadedAt: '2025-05-16T08:00:00Z' },
  { id: 'up-2', filename: 'inspection_report_may.docx', sizeMb: 0.8, status: 'processing', uploadedAt: '2025-05-16T09:15:00Z' },
]

export const suggestedQuestions: string[] = [
  "What are the tenant's repair obligations?",
  'When does the current lease expire?',
  'What is the bond amount for 12 Campbell Parade?',
]

export const enquiryWorkflowSteps: AgentWorkflowStep[] = [
  { label: 'Intent classified', status: 'done', detail: 'billing_dispute · 18ms' },
  { label: 'RAG retrieval', status: 'done', detail: '3 docs · 94ms' },
  { label: 'LLM draft', status: 'done', detail: 'gpt-4o · 1.4s' },
  { label: 'Compliance check', status: 'done', detail: 'NSW tenancy rules' },
  { label: 'Awaiting action', status: 'active', detail: 'send / edit / regenerate' },
]

export const docSearchWorkflowSteps: AgentWorkflowStep[] = [
  { label: 'Intent classified', status: 'done', detail: '12ms' },
  { label: 'Embed query', status: 'done', detail: 'text-embedding-3-small' },
  { label: 'pgvector search', status: 'done', detail: 'HNSW · top-5' },
  { label: 'LLM synthesis', status: 'done', detail: 'gpt-4o · 1.1s' },
  { label: 'Citations', status: 'done', detail: '2 sources' },
]

export const uploadWorkflowSteps: AgentWorkflowStep[] = [
  { label: 'LlamaParse', status: 'waiting' },
  { label: 'Chunk', status: 'waiting' },
  { label: 'Embed', status: 'waiting' },
  { label: 'pgvector insert', status: 'waiting' },
]
