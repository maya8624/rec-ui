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

export type RightPanelData =
  | PropertyPanelData
  | DepositPanelData;
  // | BookingPanelData;

// ── API ───────────────────────────────────────────────────────────────────────

import { z } from 'zod';

export const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message must be 1000 characters or fewer'),
  propertyId: z.string().uuid().nullable(),
  threadId: z.string().nullable(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export interface ChatResponse {
  reply: string;
  threadId: string | null;
  propertyId?: string | null;
  listings?: PropertyListing[] | null;
}