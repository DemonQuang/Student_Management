# PRD: User Login & JWT Generation Subtask

## 1. Overview & Goal
Enable users to authenticate by submitting their credentials and receiving a signed JSON Web Token (JWT) to secure subsequent API calls.

---

## 2. User Story
As a registered user, I want to log in with my username and password so that I can get an access token to authorize my requests.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `POST /api/v1/auth/login`
- **Authentication**: None (Permit All)

### Input Validation
- `username`: Required, cannot be blank.
- `password`: Required, cannot be blank.

### Process Logic
1. Retrieve user details from the database by `username`. If the user does not exist or `enabled = false`, return 401 Unauthorized.
2. Verify that the submitted password matches the stored BCrypt-encoded password. If it does not match, return 401 Unauthorized.
3. Generate a JWT token containing:
   - Subject: `username`
   - Claims: Roles/permissions (e.g. `role = ADMIN`)
   - Issued At / Expiration Timestamps
4. Sign the token using `HS256` or `HS512` with the configured secret key.

### Expected Outputs
- **Success (200 OK)**: Returns the generated JWT token, token type (Bearer), lifetime, and user's role.
- **Fail (401 Unauthorized)**: Returns an authentication failure error message.

---

## 4. Acceptance Criteria
- [ ] Submitting correct credentials returns HTTP 200 with a valid JWT token.
- [ ] Submitting an incorrect password returns HTTP 401.
- [ ] Submitting a non-existent username returns HTTP 401.
- [ ] The generated JWT contains correct claims for the user's role and is signed with the system's secret key.
