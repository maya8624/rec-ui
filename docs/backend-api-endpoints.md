# Nexus API Endpoints

**Base URL:** `/api`

All protected endpoints require a valid auth cookie (set by login/external-login).  
All error responses use the shape:
```json
{ "code": 401, "name": "Unauthorized", "message": "..." }
```

---

## Auth — `/api/auth`

### POST `/api/auth/login`
Authenticate with email and password.

**Auth:** None required

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Response `200 OK`:**
```json
{
  "userId": "3fa85f64-...",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "token": "<JWT access token>",
  "refreshToken": "<opaque refresh token>"
}
```

**Response `401 Unauthorized`:**
```json
{ "code": 401, "name": "INVALID_CREDENTIALS", "message": "Invalid email or password" }
```

---

### POST `/api/auth/register`
Register a new user.

**Auth:** None required

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "secret",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response `200 OK`:** same shape as `/auth/login` — `{ userId, email, firstName, lastName, token, refreshToken }`

**Response `409 Conflict`:**
```json
{ "code": 409, "name": "EMAIL_TAKEN", "message": "Email already registered" }
```

---

### POST `/api/auth/external-login`
Login or register via a third-party OAuth provider (Google).

**Auth:** None required

**Request body:**
```json
{
  "idToken": "google-id-token",
  "provider": "google"
}
```

**Response `200 OK`:** same shape as `/auth/login` — `{ userId, email, firstName, lastName, token, refreshToken }`

**Response `401 Unauthorized`:**
```json
{ "code": 401, "name": "GOOGLE_TOKEN_INVALID", "message": "..." }
```

---

### POST `/api/auth/refresh`
Exchange a valid refresh token for a new access token and refresh token. No `Authorization` header required.

Refresh tokens are **single-use** — always store the new pair returned in the response.

**Auth:** None required

**Request body:**
```json
{ "refreshToken": "<stored refresh token>" }
```

**Response `200 OK`:** same shape as `/auth/login` — `{ userId, email, firstName, lastName, token, refreshToken }`

**Response `401 Unauthorized`:**
```json
{ "name": "INVALID_REFRESH_TOKEN", "message": "Refresh token is invalid or expired" }
```

---

### GET `/api/auth/me`
Return the currently authenticated user from JWT claims (no database hit).

**Auth:** Required (`Authorization: Bearer <token>`)

**Response `200 OK`:**
```json
{
  "userId": "3fa85f64-...",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response `401 Unauthorized`:** empty body

---

## AI — `/api/ai`

### POST `/api/ai/chat`
Send a message and get an AI-generated answer. Conversations are tracked by `threadId`. Optionally scope the context to a specific property via `propertyId`.

**Auth:** Required

**Request body:**
```json
{
  "message": "What properties are available in Sydney?",
  "threadId": "unique-thread-id",
  "propertyId": "guid-or-null"
}
```

| Field        | Type   | Rules                          |
|--------------|--------|-------------------------------|
| `message`    | string | Required, max 1000 characters |
| `threadId`   | string | Required                      |
| `propertyId` | string | Optional, nullable            |

**Response `200 OK`:**
```json
{
  "answer": "Here are some properties...",
  "threadId": "unique-thread-id"
}
```

---

## Deposits — `/api/deposits`

### POST `/api/deposits/checkout`
Create a Stripe Checkout session to collect a rental deposit. Redirect the user to `sessionUrl` to complete payment.

**Auth:** Required

**Request body:**
```json
{
  "propertyId": "guid",
  "listingId": "guid",
  "amount": 1500.00,
  "idempotencyKey": "unique-key-max-100-chars"
}
```

| Field            | Type    | Rules                          |
|------------------|---------|-------------------------------|
| `propertyId`     | guid    | Required                       |
| `listingId`      | guid    | Required                       |
| `amount`         | decimal | Required, greater than 0       |
| `idempotencyKey` | string  | Required, max 100 characters   |

**Response `200 OK`:**
```json
{
  "id": "guid",
  "userId": "guid",
  "propertyId": "guid",
  "listingId": "guid",
  "amount": 1500.00,
  "currency": "aud",
  "stripeSessionId": "cs_...",
  "status": "Pending",
  "paidAtUtc": null,
  "sessionUrl": "https://checkout.stripe.com/..."
}
```

> Redirect the user to `sessionUrl` to complete the Stripe Checkout flow.

---

### POST `/api/deposits/webhook`
Stripe webhook receiver. Called by Stripe to confirm payment completion. **Do not call from the UI.**

**Auth:** None required (Stripe signature verified internally)

**Headers:** `Stripe-Signature: <stripe-sig>`

**Request body:** Raw Stripe event payload (sent by Stripe, not the UI)

**Response `200 OK`:** empty body

---

## Inspection Bookings — `/api/inspection-bookings`

### POST `/api/inspection-bookings`
Book an available inspection slot for the current user.

**Auth:** Required

**Request body:**
```json
{
  "inspectionSlotId": "guid",
  "notes": "Optional notes up to 1000 chars"
}
```

| Field              | Type   | Rules                        |
|--------------------|--------|------------------------------|
| `inspectionSlotId` | guid   | Required                     |
| `notes`            | string | Optional, max 1000 characters|

**Response `201 Created`:**
```json
{
  "id": "guid",
  "userId": "guid",
  "inspectionSlotId": "guid",
  "propertyId": "guid",
  "listingId": "guid",
  "agentId": "guid",
  "status": "Confirmed",
  "notes": "Optional notes",
  "createdAtUtc": "2026-04-12T00:00:00Z",
  "updatedAtUtc": "2026-04-12T00:00:00Z"
}
```

**Location header:** `/api/inspection-bookings/{id}`

---

### GET `/api/inspection-bookings/my`
Get all inspection bookings for the current authenticated user.

**Auth:** Required

**Response `200 OK`:**
```json
[
  {
    "id": "guid",
    "userId": "guid",
    "inspectionSlotId": "guid",
    "propertyId": "guid",
    "listingId": "guid",
    "agentId": "guid",
    "status": "Confirmed",
    "notes": null,
    "createdAtUtc": "2026-04-12T00:00:00Z",
    "updatedAtUtc": "2026-04-12T00:00:00Z"
  }
]
```

---

### GET `/api/inspection-bookings/{id}`
Get a single inspection booking by ID.

**Auth:** Required

**Path params:** `id` — guid

**Response `200 OK`:** Single `InspectionBookingDto` (same shape as above)

**Response `404 Not Found`:** error response

---

### PATCH `/api/inspection-bookings/{id}/cancel`
Cancel an existing inspection booking.

**Auth:** Required

**Path params:** `id` — guid

**Request body:** none

**Response `200 OK`:** Updated `InspectionBookingDto` with `status: "Cancelled"`

---

## Inspection Slots — `/api/inspection-slots`

### POST `/api/inspection-slots`
Create a new inspection slot (agent/admin action).

**Auth:** None required

**Request body:**
```json
{
  "propertyId": "guid",
  "listingId": "guid",
  "agentId": "guid",
  "startAtUtc": "2026-05-01T10:00:00Z",
  "endAtUtc": "2026-05-01T10:30:00Z",
  "capacity": 5,
  "notes": "Optional notes up to 1000 chars"
}
```

| Field        | Type           | Rules                                    |
|--------------|----------------|------------------------------------------|
| `propertyId` | guid           | Required                                 |
| `listingId`  | guid           | Required                                 |
| `agentId`    | guid           | Required                                 |
| `startAtUtc` | DateTimeOffset | Required, must be in the future          |
| `endAtUtc`   | DateTimeOffset | Required, must be after `startAtUtc`     |
| `capacity`   | int            | Required, greater than 0                 |
| `notes`      | string         | Optional, max 1000 characters            |

**Response `201 Created`:**
```json
{
  "id": "guid",
  "listingId": "guid",
  "propertyId": "guid",
  "agentId": "guid",
  "userId": "guid",
  "startAtUtc": "2026-05-01T10:00:00Z",
  "endAtUtc": "2026-05-01T10:30:00Z",
  "capacity": 5,
  "status": "Available",
  "notes": null,
  "createdAtUtc": "2026-04-12T00:00:00Z",
  "updatedAtUtc": "2026-04-12T00:00:00Z"
}
```

**Location header:** `/api/inspection-slots/{id}`

---

### GET `/api/inspection-slots/available?listingId={listingId}`
Get all available inspection slots for a listing.

**Auth:** None required

**Query params:**

| Param       | Type | Required |
|-------------|------|----------|
| `listingId` | guid | Yes      |

**Response `200 OK`:** Array of `InspectionSlotDto` (same shape as above)

---

### GET `/api/inspection-slots/{id}`
Get a single inspection slot by ID.

**Auth:** None required

**Path params:** `id` — guid

**Response `200 OK`:** Single `InspectionSlotDto`

**Response `404 Not Found`:** error response

---

### PATCH `/api/inspection-slots/{id}`
Update an existing inspection slot.

**Auth:** None required

**Path params:** `id` — guid

**Request body:**
```json
{
  "agentId": "guid",
  "startAtUtc": "2026-05-01T11:00:00Z",
  "endAtUtc": "2026-05-01T11:30:00Z",
  "capacity": 3,
  "notes": "Updated notes"
}
```

**Response `200 OK`:** Updated `InspectionSlotDto`

---

### PATCH `/api/inspection-slots/{id}/cancel`
Cancel an inspection slot.

**Auth:** None required

**Path params:** `id` — guid

**Request body:** none

**Response `200 OK`:** Updated `InspectionSlotDto` with `status: "Cancelled"`

---

### DELETE `/api/inspection-slots/{id}`
Delete an inspection slot. Currently returns `200 OK` with no body (no-op implementation).

**Auth:** None required

**Path params:** `id` — guid

**Response `200 OK`:** empty body

---

## Properties — `/api/properties`

### GET `/api/properties`
Get a paginated list of properties with optional type filter.

**Auth:** None required

**Query params:**

| Param      | Type   | Default | Rules                                              |
|------------|--------|---------|----------------------------------------------------|
| `page`     | int    | `1`     | Greater than 0                                     |
| `pageSize` | int    | `10`    | Greater than 0, max 100                            |
| `type`     | string | —       | Optional: `House`, `Apartment`, `Townhouse`, `Villa`, `Land` |

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": "guid",
      "title": "Modern 3-bed house in Sydney",
      "address": "123 Main St",
      "suburb": "Surry Hills",
      "state": "NSW",
      "postcode": "2010",
      "price": "$1,200,000",
      "priceValue": 1200000.00,
      "propertyType": "House",
      "bedrooms": 3,
      "bathrooms": 2,
      "parking": 1,
      "landSize": 350,
      "description": "...",
      "features": ["Backyard", "Dishwasher"],
      "images": ["https://..."],
      "agent": {
        "name": "Jane Smith",
        "phone": "0400 000 000",
        "agency": "Nexus Realty",
        "photo": "https://..."
      },
      "auctionDate": "2026-05-15",
      "isNew": true,
      "isFeatured": false,
      "inspectionTimes": ["Sat 12 Apr, 10:00–10:30am"],
      "listedDate": "2026-04-01"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 42,
  "totalPages": 5
}
```

---

### GET `/api/properties/{id}`
Get a single property by ID.

**Auth:** None required

**Path params:** `id` — guid

**Response `200 OK`:** Single `PropertyDto` (same shape as items above)

**Response `404 Not Found`:** error response

---

## Common Error Response

All failure responses follow this shape:

```json
{
  "code": 404,
  "name": "NotFound",
  "message": "The requested resource was not found."
}
```

| HTTP Status | Meaning               |
|-------------|-----------------------|
| 400         | Validation error      |
| 401         | Unauthenticated       |
| 403         | Forbidden             |
| 404         | Not found             |
| 409         | Conflict              |
| 500         | Internal server error |
