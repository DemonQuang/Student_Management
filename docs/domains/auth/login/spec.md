# Functional Specification: User Login & JWT Generation

## 1. Functional Overview
Authenticate users by validating submitted credentials against the database and returning a signed JWT token on success.

---

## 2. Input Validation Matrix

| Field Name | Type | Constraints | Failure Trigger | Error Response Code / Message |
| :--- | :--- | :--- | :--- | :--- |
| `username` | String | Not blank | Empty or whitespace | 400 Bad Request / "Username is required" |
| `password` | String | Not blank | Empty or whitespace | 400 Bad Request / "Password is required" |

---

## 3. Operational Workflow

1. **Authentication request receipt**: Client sends `LoginRequest` via HTTP POST.
2. **Credential validation**:
   - Query user document from MongoDB by `username`.
   - Verify document `enabled` state is true.
   - Verify submitted password matches BCrypt hash.
   - If user does not exist, matches false password, or is disabled, throw `BadCredentialsException` (returns HTTP 401).
3. **Token Creation**:
   - Construct security authentication object and set roles/claims.
   - Call `JwtTokenProvider` to sign claims, generating the Bearer JWT.
4. **Respond**: Return token structure.

---

## 4. Response Scenarios

### Success Scenario (200 OK)
- **Condition**: Matches credentials.
- **Response**:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIs...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "role": "ADMIN"
  }
}
```

### Credentials Failure Scenario (401 Unauthorized)
- **Condition**: Password matching fails or username doesn't exist.
- **Response**:
```json
{
  "success": false,
  "message": "Bad credentials / Invalid username or password"
}
```
