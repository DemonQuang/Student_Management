# Functional Specification: Delete Student

## 1. Functional Overview
Enable system administrators (`ADMIN` role) to execute a soft deletion of a student record, updating its status to `deleted = true` without removing it from database.

---

## 2. Security Validation Matrix

| HTTP Method | Resource URI | Target Role | Unauthenticated Response | Unauthorized Response |
| :--- | :--- | :--- | :--- | :--- |
| `DELETE` | `/api/v1/students/{id}` | `ADMIN` | 401 Unauthorized | 403 Forbidden |

---

## 3. Operational Workflow

1. **Security Assertion**: Verify request holds valid `ADMIN` JWT role. If fail, return 401/403.
2. **Student retrieval**:
   - Query if student exists by path parameter `id` and is active (`deleted == false`).
   - If missing, return 404 Not Found.
3. **Soft-delete execution**:
   - Toggle `deleted` attribute on Student document to `true`.
   - Update audit modification details.
   - Save via repository.
4. **Respond**: Return a 200 OK success JSON response.

---

## 4. Response Scenarios

### Success Scenario (200 OK)
```json
{
  "success": true,
  "message": "Student deleted successfully (Soft delete)"
}
```

### Student Missing Scenario (404 Not Found)
- **Condition**: Student does not exist or has already been soft-deleted.
- **Response**:
```json
{
  "success": false,
  "message": "Student not found with ID: 60c72b2f9b1d8b2bad999999"
}
```
  *(Soft-deleted rows cannot be queried or updated subsequently).*
