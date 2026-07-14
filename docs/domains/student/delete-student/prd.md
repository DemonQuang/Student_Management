# PRD: Delete Student Subtask

## 1. Overview & Goal
Enable administrators to delete student records using a soft-deletion mechanism.

---

## 2. User Story
As an administrator, I want to delete a student record so that they no longer appear in the student list, while retaining their historical records in the database.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `DELETE /api/v1/students/{id}`
- **Authentication**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The student's database ID)

### Process Logic
1. Validate authorization (`ADMIN` role).
2. Fetch the Student by `id` from the database. If not found or if the student's `deleted` flag is already true, throw `ResourceNotFoundException` (resulting in HTTP 404).
3. Set `deleted = true`.
4. Auto-populate audit details (`updatedBy`, `updatedAt`) via Spring Auditor.
5. Save the updated Student entity.

### Expected Outputs
- **Success (200 OK)**: Returns confirmation that the student was soft-deleted successfully.
- **Fail (404 Not Found)**: If the student ID does not exist or has already been soft-deleted.

---

## 4. Acceptance Criteria
- [ ] Invoking delete on an active student ID returns HTTP 200 and sets `deleted = 1` (or `true`) in the database.
- [ ] Subsequent queries to retrieve the student list or student details return 404/not found.
- [ ] Re-invoking delete on a previously soft-deleted student ID returns HTTP 404.
- [ ] Non-admin requests are blocked with HTTP 403.
