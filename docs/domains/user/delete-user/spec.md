# Functional Specification: Delete User

## 1. Functional Overview
Enable system administrators with the `ADMIN` role to delete a user account from the database.

---

## 2. Security Validation Matrix

| HTTP Method | Resource URI | Target Role | Unauthenticated Response | Unauthorized Response |
| :--- | :--- | :--- | :--- | :--- |
| `DELETE` | `/api/v1/users/{id}` | `ADMIN` | 401 Unauthorized | 403 Forbidden |

---

## 3. Operational Workflow

1. **Security Assertion**: Verify request holds valid `ADMIN` JWT role. If fail, return 401/403.
2. **User lookup**:
   - Query user by path parameter `id` from MongoDB.
   - If user does not exist, return 404 Not Found.
3. **Execution**:
   - Delete document via repository or set `enabled = false`.
4. **Respond**: Return a 200 OK confirmation.

---

## 4. Response Scenarios

### Success Scenario (200 OK)
- **Condition**: Caller is ADMIN, User exists.
- **Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### User Missing Scenario (404 Not Found)
- **Condition**: Target User ID does not exist in collection.
- **Response**:
```json
{
  "success": false,
  "message": "User not found with id: 60c72b2f9b1d8b2bad999999"
}
```
