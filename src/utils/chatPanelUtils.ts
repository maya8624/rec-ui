import type { DepositPanelData } from '../types/chat';

const DEPOSIT_INTENT_KEYWORDS = [
  'deposit', 'pay deposit', 'make a deposit', 'paying deposit',
];

export function detectPanelData(userMessage: string): DepositPanelData | null {
  const lower = userMessage.toLowerCase();

  const hasDepositIntent = DEPOSIT_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
  if (hasDepositIntent) {
    return {
      type: 'deposit',
      title: 'Pay Deposit',
      propertyId: null,
      listingId: null,
      propertyTitle: null,
      suggestedAmount: null,
    } satisfies DepositPanelData;
  }

  return null;
}
