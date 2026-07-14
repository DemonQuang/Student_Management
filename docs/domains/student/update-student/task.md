# Task Checklist: Update Student

This checklist tracks the development tasks required to implement the student update endpoint (`PUT /api/v1/students/{id}`).

---

## 1. Model & Validation DTOs
- [ ] Create `StudentUpdateRequest` DTO.
- [ ] Add JSR-380 input validation annotations on DTO fields.

## 2. Repository Layer
- [ ] Create methods in `StudentRepository`:
  - `existsByEmailAndIdNot(String email, String id)`
  - `existsByPhoneAndIdNot(String phone, String id)`

## 3. Service Layer
- [ ] Define `updateStudent(String id, StudentUpdateRequest request)` in `StudentService`.
- [ ] Implement `updateStudent()` in `StudentServiceImpl`.
- [ ] Fetch student from database using `findByIdAndDeletedFalse(id)`. If missing, throw `ResourceNotFoundException`.
- [ ] Implement uniqueness checks: call repository exists checks for email and phone excluding the current student ID. Throw `DuplicateDataException` on matches.
- [ ] Implement referential checks: check if `departmentId` exists and `classroomId` exists. Throw `ResourceNotFoundException` on missing links.
- [ ] Copy request fields onto the existing student document, keeping `studentCode` unchanged.
- [ ] Save the student document and convert result to response DTO.

## 4. Controller Layer
- [ ] Map endpoint `PUT /api/v1/students/{id}` inside `StudentController`.
- [ ] Add `@Valid` annotation to request body parameter.
- [ ] Restrict access using `@PreAuthorize("hasRole('ADMIN')")`.

## 5. Verification & Testing
- [ ] Write unit tests mapping success, duplicate validations, and missing department/classroom.
- [ ] Run `mvn test` and verify code coverage is `> 80%`.
