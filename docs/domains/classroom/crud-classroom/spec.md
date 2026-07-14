# Functional Specification: CRUD Classroom

## 1. Functional Overview
Enable system administrators (`ADMIN` role) to create, update, and delete academic Classroom records, mapping them to departments. Protect classrooms from deletion if active students are enrolled.

---

## 2. Input Validation Matrix

| HTTP Method | Field Name | Constraints | Failure Trigger | Error Response Message |
| :--- | :--- | :--- | :--- | :--- |
| `POST` / `PUT` | `name` | Not blank | Empty or whitespace | "Classroom name is required" |
| `POST` / `PUT` | `departmentId` | Not blank | Empty | "Department ID is required" |

---

## 3. Operational Workflow

### Create (`POST`) & Update (`PUT`)
1. Verify payload inputs. If fail, return 400.
2. Query if parent Department exists in MongoDB. If no, return 404 Not Found ("Department not found").
3. For `PUT` (Update) requests:
   - Check if the Classroom's `departmentId` is being modified.
   - If yes, query if there are any students linked to this Classroom (including both active and soft-deleted: `classroomId == targetId`).
   - If students exist, block execution and return HTTP 400 Bad Request ("Cannot change department of a classroom that already has enrolled students").
4. Save Classroom record in MongoDB.

### Delete (`DELETE`)
1. Query classroom by path parameter `id`. If missing, return 404.
2. Query if any students exist containing the target `classroomId` (`classroomId` equals target, ignoring the `deleted` flag).
3. **Relation Check**:
   - If students exist (active or soft-deleted), block delete execution and return HTTP 400 Bad Request ("Cannot delete classroom: There are students enrolled in this classroom.").
   - If no students exist, execute hard delete. Return 200 OK.

---

## 4. Response Scenarios

### Delete Blocked Scenario (400 Bad Request)
- **Condition**: Target Classroom contains students (including soft-deleted).
- **Response**:
```json
{
  "success": false,
  "message": "Cannot delete classroom: There are students enrolled in this classroom."
}
```

### Update Department Blocked Scenario (400 Bad Request)
- **Condition**: Attempting to change `departmentId` of a Classroom that has enrolled students.
- **Response**:
```json
{
  "success": false,
  "message": "Cannot change department: There are students enrolled in this classroom."
}
```
