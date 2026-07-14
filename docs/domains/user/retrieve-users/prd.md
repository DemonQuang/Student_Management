# PRD: Retrieve User List Subtask

## 1. Overview & Goal
Allows system administrators to fetch the list of all registered user accounts.

---

## 2. User Story
As an administrator, I want to view a list of all user accounts so that I can audit who has access to the application.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `GET /api/v1/users`
- **Authentication**: Yes (`ADMIN` role only)

### Process Logic
1. Verify the request has a valid JWT containing the `ADMIN` role. If not, return 401 Unauthorized or 403 Forbidden.
2. Query the database for all user records.
3. Map User entities to User Response DTOs (excluding password hashes).

### Expected Outputs
- **Success (200 OK)**: A JSON array of user details.
- **Fail (401 Unauthorized / 403 Forbidden)**: Correct HTTP error for unauthorized users.

---

## 4. Acceptance Criteria
- [ ] Invoking endpoint with a valid ADMIN JWT returns HTTP 200 with the list of users.
- [ ] Invoking endpoint with a USER JWT returns HTTP 403 Forbidden.
- [ ] Invoking endpoint without a JWT returns HTTP 401 Unauthorized.
- [ ] The returned user objects do not expose the password field or password hash.
