# Auth System Summary

## Overview

This project uses **HttpOnly cookie-based auth** against a real .NET backend. Auth state is managed with **Zustand** (no `persist` middleware — the browser owns the cookie, not JS). The stack is React 19 + TypeScript + React Router v7 + Tailwind CSS v4.

> For architecture decisions and security rationale, see [`docs/auth-architecture.md`](./auth-architecture.md).  
> For API endpoint specs, see [`docs/backend-auth.md`](./backend-auth.md).

---

## File Map

| File | Role |
|------|------|
| `src/types/auth.ts` | Shared types — `AuthUser`, `AuthResponse`, `ErrorResponse` |
| `src/api/authApi.ts` | Auth API functions — login, register, logout, me, externalLogin |
| `src/store/authStore.ts` | Global auth state — user, isAuthenticated, isInitializing |
| `src/components/AuthGuard.tsx` | Route guard — waits for init, then redirects unauthenticated users |
| `src/pages/LoginPage.tsx` | Sign-in UI — email/password + Google OAuth (GSI) |
| `src/pages/RegisterPage.tsx` | Sign-up UI — email, password, confirm password + Google OAuth (GSI) |
| `src/services/apiClient.ts` | Axios instance — `withCredentials: true`, auto-logout on 401 |

---

## Auth Types (`auth.ts`)

```ts
type AuthUser = {
  userId: string;
  email: string;
};

type AuthResponse = AuthUser; // login + register return same shape

type ErrorResponse = {
  code: number;    // mirrors HTTP status
  name: string;   // e.g. "INVALID_CREDENTIALS", "EMAIL_TAKEN"
  message: string;
};
```

No `name`, no `role`, no `token` — matches actual backend response.

---

## Auth Store (`authStore.ts`)

**State shape:**
```ts
{
  user: AuthUser | null,
  isAuthenticated: boolean,
  isInitializing: boolean,  // true while GET /api/auth/me is in flight on app load
}
```

No `token` field. No `persist` middleware. The browser manages the cookie.

**Actions:**
- `initialize()` — calls `GET /api/auth/me` on app mount to rehydrate state. Sets `isInitializing: true` while in flight.
- `login(email, password)` — calls `POST /api/auth/login`, sets user on success.
- `register(email, password)` — calls `POST /api/auth/register`. Auto-logs in on success (201 sets cookie), navigates to `/`.
- `logout()` — calls `POST /api/auth/logout` to clear the server cookie, then clears local state.
- `loginWithGoogle(idToken)` — calls `POST /api/auth/external-login` with `{ provider: "google", idToken }`.

**Rehydration flow (every page load):**
```
App mounts → initialize() fires
  → GET /api/auth/me  (browser sends cookie automatically)
  → 200: user = { userId, email }, isAuthenticated = true
  → 401: user = null, isAuthenticated = false
  → isInitializing = false → app renders
```

---

## API Client (`apiClient.ts`)

Axios instance with:
- `baseURL` from `config.apiBaseUrl`
- `withCredentials: true` — sends the HttpOnly cookie on every request automatically
- **No request interceptor** — no Bearer token to attach
- **Response interceptor:** On `401` from a non-auth endpoint, calls `useAuthStore.getState().logout()` automatically

---

## AuthGuard (`AuthGuard.tsx`)

Wraps protected routes. Two-phase check:

1. While `isInitializing` is true → render a loading spinner (do not redirect yet)
2. Once initialized: `!isAuthenticated` → redirect to `/login` with `state.from` for post-login redirect

**Public routes:** `/`, `/property/:id`, `/login`, `/register`  
**Protected routes:** `/assistant`, `/deposit/success`, `/deposit/cancel`

**Placement:** Always in `App.tsx`, never in `main.tsx` (`useLocation` requires being inside `<BrowserRouter>`).

```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/" element={<MainLayout />}>
    <Route index element={<ListPage />} />
    <Route path="property/:id" element={<DetailPage />} />
  </Route>
  <Route element={<AuthGuard><Outlet /></AuthGuard>}>
    <Route path="/assistant" element={<AssistantPage />} />
    <Route path="/deposit/success" element={<DepositSuccessPage />} />
    <Route path="/deposit/cancel" element={<DepositCancelPage />} />
  </Route>
</Routes>
```

---

## LoginPage (`LoginPage.tsx`)

**Form fields:**
- Email (`type="email"`, required)
- Password (`type="password"`, required)

**Submit behavior:**
1. Calls `authStore.login(email, password)`
2. On success → reads `state.from`, redirects back (default `/`)
3. On failure → shows inline error banner with server `message`

**Loading states:**
- `isLoading` — active during email/password submit; shows spinner + "Signing in..." on button
- `isGoogleLoading` — active while Google credential is being exchanged

**Google OAuth:**
- Uses Google Identity Services (GSI) — loaded via `<script>` in `index.html`
- `google.accounts.id.renderButton` renders the native Google button in a `div#google-signin-btn`
- On credential callback → calls `authStore.loginWithGoogle(response.credential)`

**Navigation link:** "Sign up" → `/register`

---

## RegisterPage (`RegisterPage.tsx`)

**Form fields:**
- Email (required)
- Password (required, min 6 chars — validated client-side)
- Confirm password (must match — validated client-side)

> No `name` field — the backend register endpoint does not accept it.

**Submit behavior:**
1. Client-side validation (password length, confirm match)
2. Calls `POST /api/auth/register` via `authStore.register()`
3. On success (201) → navigate to `/` directly (register auto-logs in via cookie)
4. On failure (409 `EMAIL_TAKEN`) → shows inline error banner

**Google OAuth:** Same GSI button as LoginPage — shares the same `loginWithGoogle` action.

**Navigation link:** "Sign in" → `/login`

---

## Google OAuth Setup

GSI script loaded in `index.html`:
```html
<script src="https://accounts.google.com/gsi/client" async></script>
```

Google Client ID (dev): `792777166754-sn1bgl9c1h4o43cit76pps1r83h4joej.apps.googleusercontent.com`

Both `LoginPage` and `RegisterPage` use the same flow — the backend `POST /api/auth/external-login` handles both login and register for OAuth users.

---

## UI Design Conventions

- Tailwind CSS utility classes throughout
- Rounded inputs: `rounded-xl`, `focus:ring-2 focus:ring-blue-500/20`
- Primary button: `bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400`
- Error banner: `bg-red-50 border border-red-200 rounded-xl` with SVG warning icon
- Spinner: animated SVG (`animate-spin`) inline with button text
- Card container: `bg-white rounded-2xl border border-gray-200 p-6 sm:p-8`

---

## Known Limitations

| Issue | Detail |
|-------|--------|
| Cookie expiry mismatch | Cookie expires in 5 min, JWT valid for 2h — users may get logged out early. Fix pending on backend. |
| No token refresh | Once the cookie expires, user must re-authenticate. No silent refresh implemented. |
| Microsoft / Apple OAuth | Not yet implemented — only Google is wired up. |
