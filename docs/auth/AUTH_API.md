# CivicFix Authentication API Reference

This document covers only the backend authentication APIs that are currently implemented and verified in the server. It intentionally excludes any future or unimplemented endpoints.

## Authentication Model

The backend uses JWT-based authentication with an HttpOnly cookie.

- The JWT is created in the auth service and signed using the configured `JWT_SECRET`.
- The token is stored in a cookie named `token`.
- Cookie options used by the server:
  - `httpOnly: true`
  - `sameSite: "lax"`
  - `secure: process.env.NODE_ENV === "production"`
  - `maxAge: 7 * 24 * 60 * 60 * 1000` (7 days)
- The cookie is set on successful register and login responses.
- Authentication between requests is maintained by sending the cookie automatically with browser requests, as long as the client is on the same site and includes credentials when needed.
- The server also supports a fallback `Authorization: Bearer <token>` header in the authentication middleware, but the primary mechanism is the HttpOnly cookie.
- Passwords and JWTs are never returned in API JSON responses.
- `password_hash` is removed from the user payload before it is sent back to the client.
- Current user roles are:
  - `citizen`
  - `department_admin`
  - `super_admin`

## Relevant Authentication Status Codes

- `200 OK`: successful request completion
- `201 Created`: user registration success
- `400 Bad Request`: invalid payload or validation error
- `401 Unauthorized`: missing, invalid, or expired token
- `404 Not Found`: requested user record is missing
- `409 Conflict`: user already exists during registration
- `500 Internal Server Error`: unexpected server error

## Frontend and Backend Origin Notes

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- These are different origins.
- Cross-origin frontend requests must use `credentials: 'include'`.
- Backend CORS uses `credentials: true`.
- Authentication is maintained through the HttpOnly `token` cookie.

---

## 1) Register User

### API Name

Register user

### Method + Endpoint

POST /api/auth/register

### Purpose

Create a new user account and immediately establish a session by setting the JWT cookie.

### Authentication Required

No

### Allowed Role

The role must be one of the allowed roles for registration:

- `citizen`
- `department_admin`
- `super_admin`

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "full_name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123",
  "role": "citizen"
}
```

### Request Parameters

No URL parameters.

### Success Response

Status: `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": 12,
    "full_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "citizen",
    "created_at": "2026-09-12T10:15:00.000Z",
    "updated_at": "2026-09-12T10:15:00.000Z"
  }
}
```

The server also sets the authentication cookie, for example:

```http
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; SameSite=Lax; Max-Age=604800; Path=/
```

### Error Responses

#### 400 Bad Request

```json
{
  "success": false,
  "message": "Password must be at least 8 characters long."
}
```

#### 409 Conflict

```json
{
  "success": false,
  "message": "An account with this email already exists."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

### Database Changes

- Inserts a new row into the `users` table.
- SQL pattern used by the server:

```sql
INSERT INTO users (full_name, email, password_hash, role)
VALUES (?, ?, ?, ?)
```

- The password is converted to a hash using `bcrypt.hash(password, 12)` before storage.
- No JWT or raw password is stored in the response payload.

### Notes / Integration Details

- The request validates:
  - full name length >= 2
  - valid email format
  - password length >= 8
  - role must be one of `citizen`, `department_admin`, `super_admin`
- The response payload does not include `password_hash` or the JWT token.
- Cookies are automatically sent by the browser for subsequent authenticated requests when using the same origin and proper cookie credentials configuration.

---

## 2) Login User

### API Name

Login user

### Method + Endpoint

POST /api/auth/login

### Purpose

Authenticate an existing user using email and password, then set the JWT cookie for future requests.

### Authentication Required

No

### Allowed Role

Any valid user stored in the `users` table. The login flow does not accept a role from the request body.

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "jane.doe@example.com",
  "password": "Password123"
}
```

### Request Parameters

No URL parameters.

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": 12,
    "full_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "citizen",
    "created_at": "2026-09-12T10:15:00.000Z",
    "updated_at": "2026-09-12T10:15:00.000Z"
  }
}
```

The server also sets the `token` cookie:

```http
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; SameSite=Lax; Max-Age=604800; Path=/
```

### Error Responses

#### 400 Bad Request

```json
{
  "success": false,
  "message": "A valid email address is required."
}
```

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

### Database Changes

- Reads the user by email before validating the password.
- SQL pattern used by the server:

```sql
SELECT * FROM users WHERE email = ?
```

- No new user row is created during login.
- The password is checked with `bcrypt.compare(password, user.password_hash)`.
- No `password_hash` or raw password is included in the response object.

### Notes / Integration Details

- Login validates email format and minimum password length (`>= 8`) before checking credentials.
- Successful login generates a JWT using the user’s `id`, `email`, and `role`.
- The JWT is not returned in JSON; it is stored in the HttpOnly cookie.
- The current server does not sign users out automatically on the server side; logout is handled by clearing the cookie on the client response.

---

## 3) Logout User

### API Name

Logout user

### Method + Endpoint

POST /api/auth/logout

### Purpose

Clear the current authentication cookie and end the session.

### Authentication Required

Not strictly enforced by the route itself, but it is intended to be called with the current user’s cookie.

### Allowed Role

Any role or no role; the route does not check the user role.

### Request Headers

```http
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

A request may also include the JWT in an Authorization header, but the logout implementation primarily clears the `token` cookie.

### Request Body

No request body.

### Request Parameters

No URL parameters.

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

The server also clears the cookie with a response like:

```http
Set-Cookie: token=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/
```

### Error Responses

This route does not perform additional validation beyond clearing the cookie. In practice, a request without a valid cookie may still receive a successful logout response because the code does not actively reject unauthenticated logout attempts.

Typical success response:

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

### Database Changes

No database write occurs during logout.

### Notes / Integration Details

- The server calls `res.clearCookie("token", { httpOnly: true, secure: ..., sameSite: "lax" })`.
- This removes the cookie from the browser so future requests will no longer carry the JWT.
- The next request to `/api/auth/me` with the cleared cookie should fail with `401` because no valid token is present.

---

## 4) Get Current Authenticated User

### API Name

Get current user

### Method + Endpoint

GET /api/auth/me

### Purpose

Return the current authenticated user using the validated JWT from the cookie or Authorization header.

### Authentication Required

Yes

### Allowed Role

Any authenticated user. There is no role-based restriction in the route; any valid token with a matching user record is accepted.

### Request Headers

#### Cookie-based auth (primary)

```http
Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Bearer token fallback

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Request Body

No request body.

### Request Parameters

No URL parameters.

### Success Response

Status: `200 OK`

```json
{
  "success": true,
  "user": {
    "id": 12,
    "full_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "citizen",
    "created_at": "2026-09-12T10:15:00.000Z",
    "updated_at": "2026-09-12T10:15:00.000Z"
  }
}
```

### Error Responses

#### 401 Unauthorized — no token

```json
{
  "success": false,
  "message": "Authentication required."
}
```

#### 401 Unauthorized — invalid or expired token

```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "User not found."
}
```

### Database Changes

- No insert or update calls happen in this route.
- The middleware reads the token and then loads the user by `id` using:

```sql
SELECT * FROM users WHERE id = ?
```

### Notes / Integration Details

- The authentication middleware parses the cookie header, extracts the `token` value, and verifies it with `jwt.verify`.
- If verification succeeds, it loads the user record by `decoded.id` and sets `req.user` for the response.
- The user object is sanitized before being returned; `password_hash` is removed.
- This is the endpoint used to verify whether a browser session remains valid after login.

---

## Implementation Notes for Frontend Integration

- Frontend requests to protected routes should send cookies with `credentials: 'include'` when working with cross-origin requests.
- The app’s CORS configuration is:

```js
cors({
  origin: FRONTEND_URL,
  credentials: true,
});
```

- The default frontend origin is `http://localhost:5173`.
- The default backend origin is `http://localhost:5000`.
- These are different origins.
- JWT authentication is maintained by the browser storing the `token` cookie; the server checks it on each authenticated request.
- The backend does not expose JWT tokens or password hashes in JSON.
- The current authentication system is session-like, but it is implemented as a cookie-backed JWT rather than a server-side session store.
