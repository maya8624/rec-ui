# Auth System Summary

## Overview

This project uses **JWT bearer token auth** against a real .NET backend. Auth state is managed with **React Query** (`useCurrentUser`) — no Zustand, no `persist` middleware. Tokens are stored in `localStorage` via `tokenStorage`. The stack is React 19 + TypeScript + React Router v7 + Tailwind CSS v4.

> For architecture decisions and security rationale, see [`docs/auth-architecture.md`](./auth-architecture.md).  
> For API endpoint specs, see [`docs/backend-auth.md`](./backend-auth.md).

---

## File Map

| File | Role |
|------|------|
| `src/types/auth.ts` | Shared types — `AuthUser`, `AuthResponse`, `ErrorResponse`, `registerSchema` |
| `src/utils/tokenStorage.ts` | localStorage helpers — `get`, `getRefreshToken`, `setTokens`, `clear` |
| `src/api/authApi.ts` | Auth API functions — `loginApi`, `registerApi`, `getMeApi`, `externalLoginApi`, `refreshTokenApi` |
| `src/hooks/useCurrentUser.ts` | React Query hook — fetches and caches the current user via `GET /auth/me` |
| `src/hooks/useLogout.ts` | Clears both tokens, resets query cache, redirects to `/login` |
| `src/components/layout/AuthGuard.tsx` | Route guard — redirects unauthenticated users to `/login` |
| `src/pages/LoginPage.tsx` | Sign-in UI — email/password + Google OAuth (GSI) |
| `src/pages/RegisterPage.tsx` | Sign-up UI — email, password, confirm password, optional name + Google OAuth |
| `src/services/apiClient.ts` | Axios instance — Bearer token injection + silent refresh-on-401 interceptor |

---

## Auth Types (`auth.ts`)

```ts
type AuthUser = {
  userId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
};

// Returned by login, register, external-login, and refresh
type AuthResponse = AuthUser & {
  token: string;         // JWT access token
  refreshToken: string;  // opaque, single-use, 7-day refresh token
};

type ErrorResponse = {
  code: number;
  name: string;   // e.g. "INVALID_CREDENTIALS", "EMAIL_TAKEN"
  message: string;
};
```

`getMeApi` returns `AuthUser` (no tokens — `/auth/me` is a claims read, not a token issue).

---

## Token Storage (`tokenStorage.ts`)

```ts
tokenStorage.get()                        // access token from localStorage
tokenStorage.getRefreshToken()            // refresh token from localStorage
tokenStorage.setTokens(token, refresh)   // store both (login / register / refresh)
tokenStorage.set(token)                  // access token only (legacy, avoid)
tokenStorage.clear()                     // remove both (logout)
```

---

## API Client (`apiClient.ts`)

Axios instance with:
- `baseURL` from `config.apiBaseUrl`
- **Request interceptor:** attaches `Authorization: Bearer <access token>` if a token exists
- **Response interceptor:** on `401` from a non-auth endpoint:
  1. No refresh token → clear storage, redirect to `/login`
  2. Refresh in flight → queue the request, retry with new token when refresh resolves
  3. Otherwise → `POST /auth/refresh`, rotate both tokens, retry the original request
  4. Refresh also fails with 401 → clear storage, redirect to `/login`

---

## `useCurrentUser` Hook

```ts
export function useCurrentUser() {
    return useQuery<AuthUser>({
        queryKey: ["auth", "me"],
        queryFn: getMeApi,           // GET /auth/me — JWT claims read, no DB hit
        retry: false,
        staleTime: 5 * 60 * 1000,   // 5 min
    });
}
```

Used by `AuthGuard` and any component that needs the current user. React Query handles loading and error states. The interceptor handles token refresh transparently — components never see a 401.

---

## Rehydration Flow (every page load)

```
App mounts
  → useCurrentUser fires
  → GET /auth/me (Authorization: Bearer <stored token>)
  → 200: { userId, email, firstName, lastName } → user state restored ✓
  → 401 (token expired):
       → interceptor calls POST /auth/refresh
       → 200: tokens rotated → GET /auth/me retried ✓
       → 401: both tokens expired → redirect to /login
```

---

## Login / Register Flow

```
User submits credentials
  → loginApi / registerApi → AuthResponse
  → tokenStorage.setTokens(response.token, response.refreshToken)
  → queryClient.setQueryData(["auth", "me"], response)
  → navigate to destination
```

Google OAuth follows the same pattern — `externalLoginApi` returns the same `AuthResponse` shape.

---

## Logout Flow

```ts
export function useLogout() {
    return () => {
        tokenStorage.clear();                              // remove both tokens
        queryClient.setQueryData(["auth", "me"], null);   // clear cached user
        navigate("/login", { replace: true });
    };
}
```

---

## AuthGuard

Wraps protected routes. Reads from `useCurrentUser`:

- `isLoading` → render nothing (query in flight on first load)
- `!data` → redirect to `/login` with `state.from` for post-login redirect
- `data` → render children

**Protected routes:** `/assistant`, `/deposit/success`, `/deposit/cancel`  
**Public routes:** `/`, `/property/:id`, `/login`, `/register`

---

## Known Limitations

| Issue | Detail |
|-------|--------|
| Tokens in localStorage | Readable by JS — XSS could extract them. HttpOnly cookies would mitigate this but require backend changes. |
| No token revocation | Access tokens are valid until expiry. Logout only clears the client — the token remains valid server-side for up to 60 min. |
| Microsoft / Apple OAuth | Not yet implemented — only Google is wired up. |
| No email verification on register | Users can register with any email address. |
