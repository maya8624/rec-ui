import type {
  RagContextInfo,
  AgentWorkflowStep,
  DocMessage,
} from '../../types/agent'

export const ragContextInfo: RagContextInfo = {
  embedModel: 'BAAI/bge-m3',
  indexType: 'pgvector · HNSW',
  tenant: 'harbour-realty',
}

export const enquiryWorkflowSteps: AgentWorkflowStep[] = [
  { label: 'Intent classified', status: 'done', detail: 'billing_dispute · 18ms' },
  { label: 'RAG retrieval', status: 'done', detail: '3 docs · 94ms' },
  { label: 'LLM draft', status: 'done', detail: 'gpt-4o · 1.4s' },
  { label: 'Compliance check', status: 'done', detail: 'NSW tenancy rules' },
  { label: 'Awaiting action', status: 'active', detail: 'send / edit / regenerate' },
]

export const docSearchMockMessages: DocMessage[] = [
  {
    id: 'mock-q1',
    role: 'user',
    content: 'Are water charges included in the rent for 12 Campbell Parade?',
  },
  {
    id: 'mock-a1',
    role: 'ai',
    content:
      'Yes, according to the tenancy agreement for 12 Campbell Parade, water usage charges are included in the weekly rent of $920. The landlord is responsible for water supply costs, though the tenant is liable for excess usage above the standard 150L/day allowance.',
    sources: [
      {
        fileName: 'Residential Tenancy Agreement — 12 Campbell Pde',
        page: 4,
        score: 0.94,
        text: 'Water charges are included in the agreed weekly rent. Tenant liability applies for usage exceeding 150L/day per person.',
      },
      {
        fileName: 'Water Bill Q1 2025 — Bondi Beach',
        page: 1,
        score: 0.81,
        text: 'Q1 2025 water usage: 48,200L. Standard allowance: 45,000L. Excess: 3,200L at $0.106/L.',
      },
    ],
  },
]

export const docSearchSuggestions: string[] = [
  'What does the lease say about early termination?',
  'Is the tenant allowed to keep pets?',
  'What are the rent review conditions?',
  'What notice is required before entry?',
]

export const uploadWorkflowSteps: AgentWorkflowStep[] = [
  { label: 'LlamaParse', status: 'waiting' },
  { label: 'Chunk', status: 'waiting' },
  { label: 'Embed', status: 'waiting' },
  { label: 'pgvector insert', status: 'waiting' },
]
