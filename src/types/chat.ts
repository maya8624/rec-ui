import type { Property } from './property';

export type UserRole = "buyer" | "seller" | "agent";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

// ── Right panel ──────────────────────────────────────────────────────────────
// Discriminated union — add new panel variants here as the backend supports them.
// Each variant must have a unique `type` literal so RightPanel can narrow safely.

export interface PropertyPanelData {
  type: 'properties';
  title: string;
  properties: Property[];
}

// export interface DepositPanelData {
//   type: 'deposit';
//   title: string;
//   deposits: DepositRecord[];
// }

// export interface BookingPanelData {
//   type: 'booking';
//   title: string;
//   bookings: BookingDetail[];
// }

export type RightPanelData =
  | PropertyPanelData;
  // | DepositPanelData
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
  answer: string;
  threadId: string | null;
  /** Backend may return structured panel data alongside the text answer */
  panelData?: RightPanelData | null;
}