# rec-ui

Frontend for the real estate platform — an AI-assisted property search and listing app built with React 19, TypeScript, and Vite.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (HMR, fast builds)
- **Tailwind CSS v4**
- **React Query v5** — server state, infinite scroll
- **React Router v7** — client-side routing
- **Axios** — HTTP client
- **Zod** — runtime schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- The [rec-api](../rec-api) .NET backend running locally

### Setup

```bash
npm install
```

Create a `.env.local` file (or copy `.env.development`):

```env
VITE_API_BASE_URL=https://localhost:7289/api
```

### Dev Server

```bash
npm run dev
```

### Other Commands

```bash
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
├── api/            # API call functions (authApi, chatApi, propertyApi)
├── components/
│   ├── assistant/  # AssistantPage components (MessageList, ChatInput, etc.)
│   ├── chat/       # Floating chat panel components
│   └── layout/     # MainLayout, Header, AuthGuard
├── hooks/          # React Query hooks + useAssistantChatStream
├── pages/          # Page components
├── services/       # Axios instance (apiClient.ts)
├── types/          # Shared TypeScript types and Zod schemas
└── utils/          # tokenStorage, errorUtils, chatPanelUtils, formatPrice
```

## Routing

| Path | Page | Access |
|------|------|--------|
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/` | ListPage | Public |
| `/property/:id` | DetailPage | Public |
| `/assistant` | AssistantPage | Protected (JWT required) |
| `/deposit/success` | DepositSuccessPage | Protected |
| `/deposit/cancel` | DepositCancelPage | Protected |

Public pages (`/`, `/property/:id`) are wrapped in `MainLayout`, which renders the Header and a floating AI chat button/panel. Auth pages and protected pages render standalone (no shared layout).

## Auth

- JWT is stored in `localStorage` under `auth_token` via `src/utils/tokenStorage.ts`
- The `apiClient.ts` axios instance attaches the token as an `Authorization: Bearer` header on every request
- `AuthGuard` wraps protected routes and redirects unauthenticated users to `/login`
- Registration and login support both email/password and Google OAuth (`externalLoginApi`)
- Form validation uses Zod schemas defined in `src/types/auth.ts`

## AI Assistant

The `/assistant` page is a full-screen, three-zone layout:

```
Sidebar | ConversationPanel | RightPanel (conditional)
```

State is managed by `useAssistantChatStream()`:

- Connects to a streaming SSE endpoint (`POST /ai/chat`)
- Events: `token`, `tool_start`, `tool_end`, `result`, `error`, `done`
- Tokens are queued and drained via `requestAnimationFrame` for smooth typewriter rendering
- Tool use shows an animated status indicator (e.g. "Searching properties...")
- `threadId` and `messages` are persisted in `sessionStorage` so the conversation survives page refreshes within the tab
- `startNewChat()` aborts any in-flight request and clears session state
- A 401 response during streaming redirects to `/login`

The `RightPanel` renders contextual data (e.g. property cards) alongside the conversation. Its content is driven by a `RightPanelData` discriminated union — add new variants in `src/types/chat.ts`.

## Floating Chat Panel

The `MainLayout` also includes a lighter floating chat panel (chatbot button + slide-in overlay) available on public pages. It uses `useChat()`, a simple React Query mutation wrapping a non-streaming `POST /ai/chat` call.

## Data Fetching Notes

Property data currently comes from mock data in `src/data/properties.ts` with simulated delays. `src/api/propertyApi.ts` contains comments marking where to swap in real API calls and migrate to the shared `apiClient.ts` instance.

Two axios instances exist — `src/services/apiClient.ts` (auth + chat) and an inline instance in `propertyApi.ts` (placeholder). Consolidate to `apiClient.ts` when wiring up the real property API.
