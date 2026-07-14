# Functional Specification: JWT Authentication Filter

## 1. Functional Overview
Intercept all incoming HTTP requests to parse, validate, and set the user authentication details into the Spring Security Context if a valid Bearer JWT token is present in the headers.

---

## 2. Inbound Header Requirements

| Header Name | Expected Value Format | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | `Bearer <JWT_Token>` | Yes (for secured endpoints) | Contains the signed JSON Web Token issued upon successful login. |

---

## 3. Operational Workflow

1. **Header Extraction**:
   - Intercept request using `OncePerRequestFilter`.
   - Read the `Authorization` header.
   - If header is absent or does not begin with `"Bearer "`, skip authentication logic and delegate execution to the next filter in the chain.
2. **Token Parsing & Validation**:
   - Extract the raw JWT substring.
   - Call `JwtTokenProvider` to parse signature and assert expiry checks.
   - If invalid or expired: log warning, bypass setting security context, and delegate to filter chain.
3. **Context Injection**:
   - If valid, extract `username` from JWT body.
   - Load user details using `UserDetailsService`.
   - **Account State Verification**: Assert that the loaded User document has `enabled == true`. If the user is disabled (`enabled == false`), throw `DisabledException` (which will be handled by Spring Security and return 401 Unauthorized), bypass setting the security context, and stop request execution.
   - Build a `UsernamePasswordAuthenticationToken` using user authorities and set it in Spring Security's `SecurityContextHolder.getContext().setAuthentication(auth)`.
4. **Pass Chain**: Call `filterChain.doFilter(request, response)`.
