# Functional Specification: Create Student

## 1. Functional Overview
Enable system administrators (`ADMIN` role) to create a new student document in the database, verifying uniqueness and structural relationships.

---

## 2. Request Validation Matrix

| Field Name | Constraints | Failure Trigger | Error Response Message |
| :--- | :--- | :--- | :--- |
| `studentCode` | Not blank | Empty/whitespace | "Student code is required" |
| `fullName` | Not blank | Empty/whitespace | "Full name is required" |
| `email` | Not blank, email syntax | Empty, or invalid email format | "Email format is invalid" |
| `phone` | Not blank, exactly 10 digits | Empty, or not 10 digits | "Phone number must be exactly 10 digits" |
| `birthday` | Not null, date in past | Empty, or today/future date | "Birthday must be in the past" |
| `gender` | Not blank, matches `MALE`, `FEMALE`, `OTHER` | Empty, or other values | "Gender must be MALE, FEMALE, or OTHER" |
| `departmentId`| Not blank | Empty | "Department ID is required" |
| `classroomId` | Not blank | Empty | "Classroom ID is required" |

---

## 3. Operational Workflow

1. **Security Assertion**: Verify request holds valid `ADMIN` JWT role. If fail, return 401/403.
2. **DTO Constraint Setup**: Trigger validation annotations. If fail, return 400 Bad Request.
3. **Database Uniqueness Checks**:
   - Query if `studentCode` exists. If yes, return 409 Conflict ("Student code already exists").
   - Query if `email` exists. If yes, return 409 Conflict ("Email already exists").
   - Query if `phone` exists. If yes, return 409 Conflict ("Phone number already exists").
4. **Referential Mappings Check**:
   - Query if Department exists by `departmentId`. If no, return 404 Not Found ("Department not found").
   - Query if Classroom exists by `classroomId`. If no, return 404 Not Found ("Classroom not found").
   - **Cross-Referential Consistency Check**: Verify if the retrieved Classroom belongs to the retrieved Department (i.e., `classroom.departmentId == student.departmentId`). If they do not match, return HTTP 400 Bad Request ("Classroom does not belong to the selected Department").
5. **Execution**:
   - Assemble Student document, set `status = "ACTIVE"`, `deleted = false`.
   - Populated audit columns.
   - Save via repository.

---

## 4. Response Scenarios

### Success Scenario (201 Created)
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000009",
    "studentCode": "SV004",
    "fullName": "Le Thi D",
    "email": "thid@gmail.com",
    "phone": "0934567890",
    "birthday": "2004-09-12",
    "gender": "FEMALE",
    "address": "Danang",
    "status": "ACTIVE",
    "departmentId": "60c72b2f9b1d8b2bad000003",
    "classroomId": "60c72b2f9b1d8b2bad000005"
  }
}
```
