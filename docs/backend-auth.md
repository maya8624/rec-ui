# Auth — Frontend Integration Reference

**API base URL (dev):** `https://localhost:7289`  
**Auth mechanism:** JWT bearer token in `Authorization` header

---

## How Auth Works

Login and register return a short-lived JWT access token and a long-lived refresh token. The frontend stores both in `localStorage`. Every subsequent request attaches the access token as a Bearer header. When the access token expires, the axios interceptor silently calls `/auth/refresh` and retries the original request with the new token.

```
Client                                API
  |                                    |
  |-- POST /login (email+pass) ------->|
  |<-- 200 { token, refreshToken } ----|
  |                                    |
  |-- GET /protected (Bearer token) -->|
  |<-- 200 data -----------------------|
  |                                    |
  | (token expires)                    |
  |-- POST /auth/refresh ------------->|
  |<-- 200 { new token, new refresh } -|
  |-- GET /protected (new Bearer) ---->|
  |<-- 200 data -----------------------|
```

---

## UserResponse

Auth endpoints that return user identity use this shape:

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "Maya",
  "lastName": "Smith"
}
```

`firstName` and `lastName` are **nullable** — email-registered users without a name return `null`.

## AuthResponse

Login, register, external-login, and refresh return user identity plus tokens:

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "Maya",
  "lastName": "Smith",
  "token": "<JWT access token>",
  "refreshToken": "<opaque refresh token>"
}
```

---

## Endpoints

### POST `/api/auth/register`

Register a new user.

**Request**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "firstName": "Maya",
  "lastName": "Smith"
}
```

| Field | Validation |
|-------|-----------|
| `email` | Required, valid email |
| `password` | Required, min 8 chars, must contain a number |
| `firstName` | Optional, max 100 chars |
| `lastName` | Optional, max 100 chars |

**Success — `200 OK`** — `AuthResponse`

**Failure — `409 Conflict`**
```json
{ "code": 409, "name": "EMAIL_TAKEN", "message": "Email already registered" }
```

---

### POST `/api/auth/login`

Authenticate with email and password.

**Request**
```json
{ "email": "user@example.com", "password": "secret123" }
```

**Success — `200 OK`** — `AuthResponse`

**Failure — `401 Unauthorized`**
```json
{ "code": 401, "name": "INVALID_CREDENTIALS", "message": "Invalid email or password" }
```

---

### POST `/api/auth/external-login`

Login or register via a third-party OAuth provider (Google).

**Request**
```json
{ "provider": "google", "idToken": "<Google credential JWT>" }
```

**Success — `200 OK`** — `AuthResponse`

**Failure — `401 Unauthorized`**
```json
{ "code": 401, "name": "GOOGLE_TOKEN_INVALID" | "GOOGLE_AUTH_FAILED" | "GOOGLE_AUTH_ERROR", "message": "..." }
```

---

### POST `/api/auth/refresh`

Exchange a valid refresh token for a new access token and refresh token. No `Authorization` header required.

Refresh tokens are **single-use** — a new refresh token is issued on every call. Always store the new pair.

**Request**
```json
{ "refreshToken": "<stored refresh token>" }
```

**Success — `200 OK`** — `AuthResponse` (new `token` + new `refreshToken`)

**Failure — `401 Unauthorized`**
```json
{ "name": "INVALID_REFRESH_TOKEN", "message": "Refresh token is invalid or expired" }
```

---

### GET `/api/auth/me`

Returns the currently authenticated user from JWT claims — **no database hit**. Use on app load to rehydrate auth state.

Names are stored as JWT claims at login time. If a user updates their profile after logging in, `/me` reflects the old name until they re-authenticate.

**Success — `200 OK`** — `UserResponse` (no tokens)

**Failure — `401 Unauthorized`** — no body (token missing or expired)

---

## Token Lifetimes

| Token | Lifetime | Notes |
|-------|----------|-------|
| Access token (JWT) | 60 min | Sent as `Authorization: Bearer` |
| Refresh token (opaque) | 7 days | Single-use; rotates on every `/auth/refresh` call |

---

## Google OAuth Setup

**Client ID (dev):** `792777166754-sn1bgl9c1h4o43cit76pps1r83h4joej.apps.googleusercontent.com`

Uses Google Identity Services (GSI):

```html
<script src="https://accounts.google.com/gsi/client" async></script>
```

```tsx
google.accounts.id.initialize({
  client_id: GOOGLE_CLIENT_ID,
  callback: async ({ credential }) => {
    const response = await externalLoginApi("google", credential);
    tokenStorage.setTokens(response.token, response.refreshToken);
  },
});
```

---

## Error Response Shape

```ts
type ErrorResponse = {
  code: number;    // mirrors HTTP status
  name: string;   // machine-readable error code
  message: string;
};
```

| Endpoint | Status | `name` |
|----------|--------|--------|
| `/login` | 401 | `INVALID_CREDENTIALS` |
| `/register` | 409 | `EMAIL_TAKEN` |
| `/external-login` | 401 | `GOOGLE_TOKEN_INVALID` \| `GOOGLE_AUTH_FAILED` \| `GOOGLE_AUTH_ERROR` |
| `/refresh` | 401 | `INVALID_REFRESH_TOKEN` |
| Any protected route | 401 | *(no body)* |

---

## Known Issues & Pending Work

| Issue | Severity | Status |
|-------|----------|--------|
| Google OAuth secret in `appsettings.Development.json` | High | Move to `dotnet user-secrets` / Azure Key Vault |
| JWT symmetric key in `appsettings.Development.json` | High | Same as above |
| No rate limiting on `/login`, `/register`, `/refresh` | Medium | Pending |
| No account lockout on failed logins | Medium | Pending |
| No email verification on register | Medium | Pending |
| Microsoft OAuth — stub only, not implemented | — | Implement when required |
