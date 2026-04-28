# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, HMR)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

No test runner is configured yet.

## Environment

Copy `.env.development` or create `.env.local`:
```
VITE_API_BASE_URL=https://localhost:7289/api
```

The backend is a .NET API (separate repo). The API base URL is read via `src/config/config.ts` → `import.meta.env.VITE_API_BASE_URL`.

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, React Query v5, React Router v7, Axios.

**Routing** (`src/App.tsx`): All routes are children of `MainLayout`, which renders the persistent `Header`, page content via `<Outlet />`, and the floating AI chat panel (chatbot button + slide-in panel).

**Pages:**
- `/` → `ListPage` — infinite-scroll property listings with type filter
- `/property/:id` → `DetailPage` — property detail with image gallery, stats, agent card

**Data fetching** (`src/hooks/`):
- `useInfiniteProperties(propertyType?)` — infinite query for listing page
- `useProperty(id)` — single property query for detail page
- `useChat()` — mutation wrapping `POST /ai/chat`
- `useAssistantChat()` — full chat state for the assistant page (messages, panel data, error)

**API layer** (`src/api/`):
- `propertyApi.ts` — currently uses mock data from `src/data/properties.ts` with simulated delays. Comments mark where to swap in real API calls.
- `chatApi.ts` — validates `ChatRequest` via Zod before calling `POST /ai/chat`; also exposes `getHistory`. Uses the shared axios instance in `src/services/apiClient.ts`.

**Two axios instances exist** — `src/services/apiClient.ts` (used by chat, reads `VITE_API_BASE_URL`) and an inline instance in `src/api/propertyApi.ts` (hardcoded `/api`, used only as a placeholder). When connecting the property API to the real backend, migrate to `apiClient.ts`.

**Chat system** (`src/components/chat/`):
- `MainLayout` owns `isChatOpen` state and renders `ChatbotButton` + `ChatPanel`
- `ChatPanel` is a slide-in overlay that renders `ChatLayout`
- `ChatLayout` owns local message state and calls `useChat()`

**Assistant page** (`src/pages/AssistantPage.tsx`):
- Standalone full-screen page outside `MainLayout` (no Header, no floating chat button)
- Three-zone layout: `Sidebar` | `ConversationPanel` | `RightPanel` (conditional)
- State owned by `useAssistantChat()` — `AssistantLayout` is layout-only
- `RightPanel` renders contextual data alongside the conversation (e.g. property listings). Uses a discriminated union `RightPanelData` — add new panel variants in `src/types/chat.ts`

**Thread ID:**
- Comes from the backend response (`response.threadId`), held in plain React state — never stored on the client
- `startNewChat()` resets it to `null`

**ChatRequest schema** (`src/types/chat.ts`):
- Validated with Zod before every API call: `message` (required, max 1000 chars), `propertyId` (UUID or null), `threadId` (string or null)
- `ChatRequest` type is derived from the schema via `z.infer` — single source of truth

**Query client** (in `App.tsx`): 5-minute stale time, no refetch on window focus.
