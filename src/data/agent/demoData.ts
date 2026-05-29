import type {
  RagContextInfo,
  AgentWorkflowStep,
} from '../../types/agent'

export const ragContextInfo: RagContextInfo = {
  embedModel: 'text-embedding-3-small',
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

export const uploadWorkflowSteps: AgentWorkflowStep[] = [
  { label: 'LlamaParse', status: 'waiting' },
  { label: 'Chunk', status: 'waiting' },
  { label: 'Embed', status: 'waiting' },
  { label: 'pgvector insert', status: 'waiting' },
]
