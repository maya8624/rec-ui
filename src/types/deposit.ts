import { z } from 'zod';

export const depositRequestSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
  listingId: z.string().uuid('Invalid listing ID'),
  amount: z.number().positive('Amount must be greater than 0'),
  idempotencyKey: z.string().min(1).max(100),
});

export type DepositRequest = z.infer<typeof depositRequestSchema>;

export interface DepositResponse {
  id: string;
  userId: string;
  propertyId: string;
  listingId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: 'Pending';
  paidAtUtc: null;
  sessionUrl: string;
}
