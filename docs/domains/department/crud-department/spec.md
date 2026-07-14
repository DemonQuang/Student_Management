# Functional Specification: CRUD Department

## 1. Functional Overview
Enable system administrators (`ADMIN` role) to create, update, and delete academic Department records, and allow both roles to read them. Protect departments from being deleted if they contain classrooms.

---

## 2. Input Validation Matrix

| HTTP Method | Field Name | Constraints | Failure Trigger | Error Response Message |
| :--- | :--- | :--- | :--- | :--- |
| `POST` / `PUT` | `name` | Not blank | Empty or whitespace | "Department name is required" |

---

## 3. Operational Workflow

### Create (`POST`) & Update (`PUT`)
1. Verify payload inputs. If fail, return 400 Bad Request.
2. Check if name already exists. If yes, return 409 Conflict.
3. Save Department record in MongoDB.

### Delete (`DELETE`)
1. Query department by path parameter `id`. If missing, return 404 Not Found.
2. Query if classrooms exist containing the target `departmentId`.
3. **Relation Check**:
   - If classrooms exist, block delete execution and return HTTP 400 Bad Request with details ("Cannot delete department containing classrooms"). (Note: Since classrooms cannot be deleted if they contain students, protecting departments from classroom references implicitly secures students' academic lineage).
   - If no classrooms exist, execute hard delete. Return 200 OK.

---

## 4. Response Scenarios

### Delete Blocked Scenario (400 Bad Request)
- **Condition**: Target Department contains classrooms.
- **Response**:
```json
{
  "success": false,
  "message": "Cannot delete department: There are classrooms belonging to this department."
}
```
   *(To delete this department, classrooms must first be deleted or reassigned).*
