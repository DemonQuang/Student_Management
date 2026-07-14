# PRD: Create Student Subtask

## 1. Overview & Goal
Enable administrators to register new student records in the system while verifying unique constraints and structural mappings.

---

## 2. User Story
As an administrator, I want to create a student record with name, email, phone, birthday, department, and classroom so that they are enrolled in the system.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `POST /api/v1/students`
- **Authentication**: Yes (`ADMIN` role only)

### Input Validation
- `studentCode`: Required, must be unique.
- `fullName`: Required, cannot be blank.
- `email`: Required, unique, valid email format.
- `phone`: Required, unique, exactly 10 digits.
- `birthday`: Required, must be a date before today.
- `gender`: Required, matching enum: `MALE`, `FEMALE`, `OTHER`.
- `address`: Optional.
- `departmentId`: Required, must reference a valid, existing Department.
- `classroomId`: Required, must reference a valid, existing Classroom.

### Process Logic
1. Validate incoming JSON body using JSR 380 annotations. If invalid, throw validation exception (resulting in HTTP 400).
2. Query Database to check for duplicates on:
   - `studentCode`
   - `email`
   - `phone`
   - If any exist, throw `DuplicateDataException` (resulting in HTTP 409 Conflict).
3. Validate that `departmentId` and `classroomId` correspond to existing records in the database. If not found, throw `ResourceNotFoundException` (resulting in HTTP 404).
4. Auto-populate audit details (`createdBy`, `createdAt`) via Spring Auditor configuration.
5. Set `status = ACTIVE` and `deleted = false`.
6. Save the new Student entity.

### Expected Outputs
- **Success (201 Created)**: Returns the persisted Student object with its assigned database ID.
- **Fail (400 Bad Request)**: Returns structured validation error messages.
- **Fail (409 Conflict)**: Returns error specifying which field (`studentCode`, `email`, or `phone`) violates uniqueness.
- **Fail (404 Not Found)**: Returns error indicating that the specified Department or Classroom does not exist.

---

## 4. Acceptance Criteria
- [ ] Invoking endpoint with valid payload returns HTTP 201.
- [ ] Attempting to insert a duplicate `studentCode`, `email`, or `phone` returns HTTP 409.
- [ ] Specifying a non-existent `departmentId` or `classroomId` returns HTTP 404.
- [ ] Providing empty required fields or a future birth date returns HTTP 400.
- [ ] Non-admin requests are blocked with HTTP 403.
