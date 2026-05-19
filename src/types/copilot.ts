export type PreferenceRequest = {
  suburbs: string[]
  maxRent: number
  minBeds: number
  maxBeds: number
  petFriendly: boolean
  availableWithinDays: number
}

export type ListingItem = {
  propertyId: string
  listingId: string
  imageUrl: string
  addressLine1: string
  suburb: string
  bedrooms: number
  bathrooms: number
  price: number
  buildingSizeSqm: number | null
  propertyType: string
}

export type PreferenceResponse = {
  message: string
  listings: ListingItem[]
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

