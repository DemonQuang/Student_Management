# Functional Specification: Retrieve User List

## 1. Functional Overview
Allows administrators with the `ADMIN` role to retrieve the list of all registered user accounts.

---

## 2. Security Validation Matrix

| HTTP Method | Resource URI | Target Role | Unauthenticated Response | Unauthorized Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users` | `ADMIN` | 401 Unauthorized | 403 Forbidden |

---

## 3. Operational Workflow

1. **Authentication check**:
   - The security layer reads the JWT from the `Authorization: Bearer <Token>` header.
   - If missing/invalid, return 401 Unauthorized.
   - If role is not `ADMIN`, return 403 Forbidden.
2. **Retrieve Records**:
   - Query all documents in the `users` collection from MongoDB.
3. **DTO mapping**:
   - Strip out password hashes and serialize list as JSON.

---

## 4. Response Scenarios

### Success Scenario (200 OK)
- **Condition**: Request contains valid `ADMIN` JWT.
- **Response**:
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "60c72b2f9b1d8b2bad000001",
      "username": "admin",
      "fullName": "System Administrator",
      "email": "admin@studentmgmt.com",
      "role": "ADMIN",
      "enabled": true
    }
  ]
}
```
  *(Note that the `password` field is omitted from response)*
