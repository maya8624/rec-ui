# Auth — Frontend Integration Reference

**API base URL (dev):** `https://localhost:7289`  
**All requests must include:** `withCredentials: true` (cookie-based auth)

---

## How Auth Works

The API uses **HttpOnly cookies** — the frontend never touches the JWT directly. After any successful login/register, the server sets a `__Host-Nexus-Auth` cookie automatically. Every subsequent request sends this cookie automatically as long as `withCredentials: true` is set on the axios instance.

```
Client                          API
  |                              |
  |-- POST /login (email+pass) ->|
  |<- 200 + Set-Cookie JWT -------|
  |                              |
  |-- GET /any-protected (cookie)|
  |<- 200 data ------------------|
```

> **Important:** Never store or read the JWT manually. The browser manages the cookie. Do not put the token in localStorage or Authorization headers.

---

## UserResponse

All auth endpoints return a consistent `UserResponse` shape:

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "Maya",
  "lastName": "Smith"
}
```

> `firstName` and `lastName` are **nullable** — email-registered users without a name return `null` until their profile is updated. Google OAuth users always have names populated from their Google account.

---

## Endpoints

### POST `/api/auth/register`

Register a new user. Auto-logs in on success (sets cookie).

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
| `email` | Required, valid email format |
| `password` | Required, min 6 characters |
| `firstName` | Optional, max 100 chars |
| `lastName` | Optional, max 100 chars |

**Success — `201 Created`**
```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "Maya",
  "lastName": "Smith"
}
```

**Failure — `409 Conflict`**
```json
{
  "code": 409,
  "name": "EMAIL_TAKEN",
  "message": "Email already registered"
}
```

---

### POST `/api/auth/login`

Login with email and password. Sets cookie on success.

**Request**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Success — `200 OK`**
```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "Maya",
  "lastName": "Smith"
}
```

**Failure — `401 Unauthorized`**
```json
{
  "code": 401,
  "name": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

---

### POST `/api/auth/external-login`

Login or register via an external OAuth provider. Currently **Google only** — Microsoft is a stub, not yet implemented.

**Request**
```json
{
  "provider": "google",
  "idToken": "<Google credential JWT from google.accounts.id.initialize>"
}
```

**Success — `200 OK`**
```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "Maya",
  "lastName": "Smith"
}
```

**Failure — `401 Unauthorized`**
```json
{
  "code": 401,
  "name": "GOOGLE_TOKEN_INVALID" | "GOOGLE_AUTH_FAILED" | "GOOGLE_AUTH_ERROR",
  "message": "..."
}
```

| `name` | Cause |
|--------|-------|
| `GOOGLE_TOKEN_INVALID` | Token expired or invalid signature |
| `GOOGLE_AUTH_FAILED` | Google email not verified |
| `GOOGLE_AUTH_ERROR` | Network or upstream Google error |

---

### POST `/api/auth/logout`

Deletes the auth cookie. No request body needed.

**Success — `200 OK`** (empty body)

---

### GET `/api/auth/me`

Returns the currently authenticated user from JWT claims — **no database hit**. Use this on app load to rehydrate auth state.

> Because names are stored as JWT claims (`given_name`, `family_name`), `GET /me` reflects the name at the time of login. If a user updates their name after logging in, the JWT will carry the old value until they re-authenticate.

**Success — `200 OK`**
```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "firstName": "Maya",
  "lastName": "Smith"
}
```

**Failure — `401 Unauthorized`** (no valid cookie)

---

## Google OAuth Setup

**Client ID (dev):** `792777166754-sn1bgl9c1h4o43cit76pps1r83h4joej.apps.googleusercontent.com`

Use the **Google Identity Services** library (GSI) — not the deprecated Google Sign-In platform.js.

### 1. Load the GSI script

```html
<script src="https://accounts.google.com/gsi/client" async></script>
```

### 2. Initialize and render the button

```tsx
useEffect(() => {
  google.accounts.id.initialize({
    client_id: "792777166754-sn1bgl9c1h4o43cit76pps1r83h4joej.apps.googleusercontent.com",
    callback: handleGoogleCredential,
  });

  google.accounts.id.renderButton(
    document.getElementById("google-signin-btn"),
    { theme: "outline", size: "large" }
  );
}, []);
```

### 3. Send the credential to the API

```tsx
async function handleGoogleCredential(response: google.accounts.id.CredentialResponse) {
  const res = await api.post("/auth/external-login", {
    provider: "google",
    idToken: response.credential,
  });
  // res.data → { userId, email, firstName, lastName }
}
```

---

## Error Response Shape

All failure responses follow this structure:

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
| Any protected route | 401 | *(no body — cookie missing/expired)* |

---

## Cookie Details

| Property | Value |
|----------|-------|
| Name | `__Host-Nexus-Auth` |
| HttpOnly | Yes — JS cannot read it |
| Secure | Yes — HTTPS only |
| SameSite | Strict |
| Expiry | 5 min (**known issue** — token is valid 2h, cookie expires early; fix pending) |

---

## Known Issues & Pending Work

| Issue | Severity | Status |
|-------|----------|--------|
| Cookie expiry 5 min vs token 2h — premature logout | Medium | Pending — align `CookieOptions.Expires` with token lifetime |
| Google OAuth secret in `appsettings.Development.json` | High | Move to `dotnet user-secrets` / Azure Key Vault |
| JWT symmetric key in `appsettings.Development.json` | High | Same as above |
| No rate limiting on `/login` and `/register` | Medium | Pending |
| No account lockout on failed logins | Medium | Pending |
| No email verification on register | Medium | Pending |
| Microsoft OAuth — stub only, not implemented | — | Implement when required |

---

## Protected Routes

Every endpoint except `/api/auth/*` requires the cookie. A missing or expired cookie returns `401` with no body. The frontend axios interceptor catches this and calls `logout()` automatically — redirecting the user to `/login`.
