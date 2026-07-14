# Functional Specification: Update Student

## 1. Functional Overview
Enable system administrators (`ADMIN` role) to update properties of an existing, active student.

---

## 2. Request Validation Matrix
Same validation constraints as **Create Student** (valid email format, 10-digit phone, birthday in the past, valid referenced department and classroom IDs).

---

## 3. Operational Workflow

1. **Security Assertion**: Verify request holds valid `ADMIN` JWT role. If fail, return 401/403.
2. **DTO validation**: Check fields. If fail, return 400 Bad Request.
3. **Student Check**:
   - Query if student exists by path parameter `id` and is active (`deleted == false`). If no, return 404 Not Found.
4. **Uniqueness checks (excluding self)**:
   - Check if another student has the requested `email`. If yes, return 409 Conflict.
   - Check if another student has the requested `phone`. If yes, return 409 Conflict.
5. **Referential Checks**:
   - Check if `departmentId` exists. If no, return 404.
   - Check if `classroomId` exists. If no, return 404.
   - **Cross-Referential Consistency Check**: Verify if the retrieved Classroom belongs to the retrieved Department (i.e., `classroom.departmentId == student.departmentId`). If they do not match, return HTTP 400 Bad Request ("Classroom does not belong to the selected Department").
6. **Execution**:
   - Save modified fields. Populated audit columns. Save.

---

## 4. Response Scenarios

### Success Scenario (200 OK)
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000007",
    "studentCode": "SV001",
    "fullName": "Nguyen Van A Edited",
    "email": "vana_new@gmail.com",
    "phone": "0912345678",
    "birthday": "2004-01-15",
    "gender": "MALE",
    "address": "Ho Chi Minh City, Dist 1",
    "status": "ACTIVE",
    "departmentId": "60c72b2f9b1d8b2bad000003",
    "classroomId": "60c72b2f9b1d8b2bad000005"
  }
}
```
  *(Note that studentCode cannot be modified, keeping its original value).*
