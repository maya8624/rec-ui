# Deposit Payment UI — Implementation Summary

## Overview

The deposit payment feature is surfaced through the **AssistantPage** chat interface.
When a user expresses intent to pay a deposit (e.g. *"I want to pay my deposit"*),
the right panel opens with a self-contained deposit form. On confirmation the user is
redirected to Stripe Checkout via the backend's `/api/deposits/checkout` endpoint.

---

## User Flow

```
User types "I want to pay my deposit"
  → detectPanelData() detects deposit intent
  → rightPanelData set to { type: 'deposit', ... }
  → RightPanel renders <DepositPanel />
    → User reviews property, edits amount if needed
    → Clicks "Proceed to Payment"
      → POST /api/deposits/checkout
        → redirect to sessionUrl (Stripe Checkout)
          → Stripe redirects to /deposit/success or /deposit/cancel
```

---

## Architecture

The feature follows the existing `RightPanelData` discriminated-union pattern
already used by `PropertyPanelData`. No changes are needed to `useAssistantChat`
or `AssistantPage` — they already handle `rightPanelData` generically.

```
useAssistantChat.sendMessage()
  → detectPanelData()               src/utils/chatPanelUtils.ts
  → setRightPanelData(...)          type: 'deposit'
  → RightPanel                      src/components/assistant/RightPanel.tsx
    → DepositPanel                  src/components/deposit/DepositPanel.tsx
      → useDeposit()                src/hooks/useDeposit.ts
        → createCheckoutSession()   src/api/depositApi.ts
          → POST /api/deposits/checkout
```

---

## Files

### New files

| File | Purpose |
|------|---------|
| `src/types/deposit.ts` | `DepositRequest`, `DepositResponse` types and Zod validation schema |
| `src/api/depositApi.ts` | `createCheckoutSession()` — calls `POST /api/deposits/checkout` via shared `apiClient` |
| `src/hooks/useDeposit.ts` | React Query `useMutation` wrapper; exposes `checkout`, `isPending`, `error` |
| `src/components/deposit/DepositPanel.tsx` | Self-contained right-panel form: property summary, amount field, submit, inline error |
| `src/pages/DepositSuccessPage.tsx` | Landing page for Stripe success redirect |
| `src/pages/DepositCancelPage.tsx` | Landing page for Stripe cancel redirect |

### Modified files

| File | Change |
|------|--------|
| `src/types/chat.ts` | Add `DepositPanelData` variant to `RightPanelData` union (stub already commented out) |
| `src/types/property.ts` | Add `listingId?: string` — required by checkout endpoint, missing from current type |
| `src/utils/chatPanelUtils.ts` | Add deposit intent keywords; extend `detectPanelData()` to return `DepositPanelData` |
| `src/components/assistant/RightPanel.tsx` | Add `data.type === 'deposit'` branch rendering `<DepositPanel />` |
| `src/App.tsx` | Add `/deposit/success` and `/deposit/cancel` routes under `MainLayout` |

---

## Types

### `DepositPanelData` (added to `src/types/chat.ts`)

```ts
export interface DepositPanelData {
  type: 'deposit';
  title: string;
  propertyId: string;
  listingId: string;
  propertyTitle: string;
  suggestedAmount: number;
}
```

Populated by `detectPanelData()` on the client side, or supplied directly by the
backend via `ChatResponse.panelData` (backend takes precedence).

### `DepositRequest` / `DepositResponse` (in `src/types/deposit.ts`)

Mirrors the `POST /api/deposits/checkout` contract exactly. Validated with Zod
before every API call — same pattern as `ChatRequest`.

```ts
// Request
{
  propertyId: string;      // guid
  listingId: string;       // guid
  amount: number;          // > 0
  idempotencyKey: string;  // max 100 chars, crypto.randomUUID() per attempt
}

// Response
{
  id: string;
  userId: string;
  propertyId: string;
  listingId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: 'Pending';
  paidAtUtc: null;
  sessionUrl: string;      // redirect target
}
```

---

## Key Decisions

### `idempotencyKey`
Generated client-side with `crypto.randomUUID()` on each panel open (not on each
submit). This ensures retries within the same panel session reuse the same key,
while reopening the panel generates a fresh one.

### Amount
Pre-filled from `DepositPanelData.suggestedAmount` (derived from
`property.priceValue`), but the user can edit it in the panel before confirming.

### Stripe redirect
Uses `window.location.href = sessionUrl` — not React Router — because Stripe
Checkout is an external URL outside the SPA.

### `listingId` gap
The current `Property` type and mock data do not include `listingId`. It has been
added as `listingId?: string` to `src/types/property.ts`. The `DepositPanel` will
surface a clear inline error if `listingId` is missing rather than silently
submitting an invalid request. This will resolve automatically once the real API
data is connected.

### Error handling
API errors are surfaced inline inside `DepositPanel` — not via a global toast.
This keeps error context local to the action and matches the pattern used in
`ChatLayout`.

### Auth
`apiClient` (shared axios instance in `src/services/apiClient.ts`) already sends
the HttpOnly cookie automatically. No additional configuration is needed.

---

## Stripe Redirect Routes

| Route | Page | Triggered by |
|-------|------|-------------|
| `/deposit/success` | `DepositSuccessPage` | Stripe on successful payment |
| `/deposit/cancel` | `DepositCancelPage` | Stripe when user cancels checkout |

Both routes are added under `MainLayout` so the Header and navigation remain visible.

---

## Out of Scope (this iteration)

- Triggering deposit from `DetailPage` directly (can be added later by passing `DepositPanelData` from that page)
- Viewing deposit history
- Refund flows
- The `/api/deposits/webhook` endpoint — called by Stripe server-to-server, not from the UI
