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
  listingType: string
  listingStatus: string
  price: number
  bedrooms: number
  bathrooms: number
  carSpaces: number
  petFriendly: boolean
  propertyType: string
  address: string
  suburb: string
  state: string
  postcode: string
  agentName: string
  agentPhone: string
  agencyName: string
  propertyUrl: string | null
  imageUrl: string | null
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

export type SuburbRents = {
  oneBedroom: string | null
  twoBedroom: string | null
  threeBedroom: string | null
}

export type SuburbProfile = {
  name: string
  description: string
  rents: SuburbRents
  vacancyRate: string | null
  trend: string | null
}

export type SuburbSummaryResponse = {
  suburbs: SuburbProfile[]
}

export type CopilotMessage = {
  id: string
  role: 'user' | 'ai'
  text: string
  streaming?: boolean
  type?: 'suburb-summary'
  suburbSummary?: SuburbSummaryResponse
  listings?: ListingItem[]
}

