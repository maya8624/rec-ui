import type {
  RagContextInfo,
  DocMessage,
  AgentWorkflowStep,
} from '../../types/agent'

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
