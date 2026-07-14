# Functional Specification: Update User Role

## 1. Functional Overview
Enable system administrators with the `ADMIN` role to modify another user's role authorization attribute.

---

## 2. Input Validation Matrix

| Field Name | Type | Constraints | Failure Trigger | Error Response Code / Message |
| :--- | :--- | :--- | :--- | :--- |
| `role` | String | Not blank, pattern: `ADMIN` or `USER` | Empty, or values other than allowed enum | 400 Bad Request / "Role must be ADMIN or USER" |

---

## 3. Operational Workflow

1. **Security Assertion**: Verify request holds valid `ADMIN` JWT role. If fail, return 401/403.
2. **User lookup**:
   - Query user by path parameter `id` from MongoDB.
   - If user does not exist, return 404 Not Found.
3. **Role Modification**:
   - Update `role` attribute on the User document.
   - Save via repository.
4. **Respond**: Return updated document response.

---

## 4. Response Scenarios

### Success Scenario (200 OK)
- **Condition**: Target User exists, role input is valid, caller is ADMIN.
- **Response**:
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000002",
    "username": "user",
    "fullName": "Regular User",
    "email": "user@studentmgmt.com",
    "role": "ADMIN",
    "enabled": true
  }
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
