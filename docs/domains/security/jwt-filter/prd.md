# PRD: JWT Filter & Provider Subtask

## 1. Overview & Goal
Build a token provider service to generate and validate JWTs, and a custom filter to intercept requests, read tokens, and set the user authentication state in Spring Security.

---

## 2. Technical Context
As an application security service, I need to authenticate inbound requests by parsing and verifying their Bearer JWT tokens.

---

## 3. Functional Requirements

### Part A: Token Provider Service (`JwtTokenProvider` / `JwtService`)
- **Key Generation**: Sign tokens using a secret key loaded from application properties (`JWT_SECRET`).
- **Token Creation**: Generate a token containing username as subject, creation time, expiry duration, and list of roles.
- **Token Validation**: Parse the JWT, check for structural signature matches, and verify the token has not expired.

### Part B: JWT Authentication Filter (`JwtAuthenticationFilter`)
- Extends `OncePerRequestFilter`.
- Intercepts requests and extracts the `Authorization` header.
- Validates the header format (must start with `"Bearer "`).
- If token is present and valid:
  1. Extract username from token.
  2. Load user details using `UserDetailsService`.
  3. Instantiate a `UsernamePasswordAuthenticationToken` and set it in Spring Security's `SecurityContextHolder`.
- If invalid or expired, continue the filter chain (Spring Security will reject the request if the resource is protected).

---

## 4. Acceptance Criteria
- [ ] Inbound requests with a valid Bearer JWT header successfully set user authentication in the SecurityContext.
- [ ] Inbound requests with expired tokens are rejected with HTTP 401.
- [ ] Request chains continue normally even if no token is provided (so public endpoints remain accessible).
