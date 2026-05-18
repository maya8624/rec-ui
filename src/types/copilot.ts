export type PreferenceRequest = {
  suburbs: string[]
  maxRent: number
  minBeds: number
  maxBeds: number
  petFriendly: boolean
  availableWithinDays: number
}

export type PreferenceResponse = {
  message: string
  listings: Record<string, unknown>[]
  displayCount: number
  totalCount: number
  hasMore: boolean
}

export type WorkflowStep = {
  status: 'done' | 'pending' | 'waiting'
  label: string
  detail: string
}

export type CopilotMessage = {
  id: string
  role: 'user' | 'ai'
  text: string
  streaming?: boolean
}

export type Property = {
  id: string
  address: string
  suburb: string
  state: string
  postcode: string
  price: number
  beds: number
  baths: number
  cars: number
  sqm: number
  tags: string[]
  agent: string
  agentInitials: string
  badge?: 'Best match' | 'Popular' | 'Available now'
  featured?: boolean
  image: string
}
