# PRD: Update Student Subtask

## 1. Overview & Goal
Enable administrators to modify the details of an existing student while maintaining uniqueness and referential validations.

---

## 2. User Story
As an administrator, I want to edit a student's profile information so that their records reflect their current status and contact info.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `PUT /api/v1/students/{id}`
- **Authentication**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The student's database ID)

### Input Validation
- Request Body follows the same validation rules as Create Student (email format, 10-digit phone, birthday in the past, valid department and classroom links).

### Process Logic
1. Validate authorization (`ADMIN` role).
2. Fetch the existing Student by `id` from the database. If not found or if the student's `deleted` flag is true, throw `ResourceNotFoundException` (resulting in HTTP 404).
3. Validate uniqueness constraints for `email` and `phone` ensuring no other student has these values.
4. Verify the referenced `departmentId` and `classroomId` exist.
5. Update the student attributes.
6. Auto-populate audit details (`updatedBy`, `updatedAt`) via Spring Auditor.
7. Save the updated Student entity.

### Expected Outputs
- **Success (200 OK)**: Returns the updated Student object.
- **Fail (404 Not Found)**: If student ID or referenced department/classroom IDs do not exist.
- **Fail (400 Bad Request)**: Returns validation error messages.
- **Fail (409 Conflict)**: If the updated email or phone belongs to another student.

---

## 4. Acceptance Criteria
- [ ] Invoking endpoint with valid payload returns HTTP 200.
- [ ] Changing email or phone to a value occupied by *another* student returns HTTP 409 Conflict.
- [ ] Updating a non-existent student ID returns HTTP 404.
- [ ] Non-admin requests are blocked with HTTP 403.
