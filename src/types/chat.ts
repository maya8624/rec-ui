export type UserRole = "buyer" | "seller" | "agent";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export interface PropertyListing {
  propertyId: string;
  propertyUrl: string;
  listingId: string;
}

export interface ListingResult {
  property_id: string
  listing_id: string
  listing_type: string
  listing_status: string
  price: number
  bedrooms: number
  bathrooms: number
  car_spaces: number
  pet_friendly: boolean
  property_type: string
  address: string
  suburb: string
  state: string
  postcode: string
  agent_name: string
  agent_phone: string
  agency_name: string
  property_url: string | null
  image_url: string | null
}

// ── Right panel ──────────────────────────────────────────────────────────────
// Discriminated union — add new panel variants here as the backend supports them.
// Each variant must have a unique `type` literal so RightPanel can narrow safely.

export interface PropertyPanelData {
  type: 'properties';
  title: string;
  properties: PropertyListing[];
}

export interface DepositPanelData {
  type: 'deposit';
  title: string;
  propertyId: string | null;
  listingId: string | null;
  propertyTitle: string | null;
  suggestedAmount: number | null;
}

// export interface BookingPanelData {
//   type: 'booking';
//   title: string;
//   bookings: BookingDetail[];
// }

export interface ListingResultsPanelData {
  type: 'listing-results';
  title: string;
  listings: ListingResult[];
}

export type RightPanelData =
  | PropertyPanelData
  | DepositPanelData
  | ListingResultsPanelData;
  // | BookingPanelData;

// ── API ───────────────────────────────────────────────────────────────────────

import { z } from 'zod';

export const copilotMetadataSchema = z.object({
  suburbs: z.array(z.string()).nullable().optional(),
  intent: z.string().nullable().optional(),
  budgetMax: z.number().int().nullable().optional(),
  petFriendly: z.boolean().nullable().optional(),
  bedroomsMin: z.number().int().nullable().optional(),
  bedroomsMax: z.number().int().nullable().optional(),
  availableWithinDays: z.number().int().nullable().optional(),
});

export type CopilotMetadata = z.infer<typeof copilotMetadataSchema>;

export const copilotRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be 1000 characters or fewer'),
  propertyId: z.string().uuid().nullable(),
  threadId: z.string().nullable(),
  metadata: copilotMetadataSchema.nullable().optional(),
});

export type CopilotRequest = z.infer<typeof copilotRequestSchema>;

export interface ChatResponse {
  reply: string;
  threadId: string | null;
  propertyId?: string | null;
  listings?: PropertyListing[] | null;
}