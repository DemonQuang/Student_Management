# Task Checklist: Create Student

This checklist tracks the development tasks required to implement the student creation endpoint (`POST /api/v1/students`).

---

## 1. Model & Validation DTOs
- [ ] Create `StudentCreateRequest` DTO containing `studentCode`, `fullName`, `email`, `phone`, `birthday`, `gender`, `address`, `departmentId`, `classroomId`.
- [ ] Add JSR-380 input validation annotations on DTO fields.

## 2. Repository Layer
- [ ] Create methods in `StudentRepository`:
  - `existsByStudentCode(String studentCode)`
  - `existsByEmail(String email)`
  - `existsByPhone(String phone)`

## 3. Service Layer
- [ ] Define `createStudent(StudentCreateRequest request)` in `StudentService`.
- [ ] Implement `createStudent()` in `StudentServiceImpl`.
- [ ] Implement uniqueness checks: call repository exists checks for studentCode, email, and phone. Throw `DuplicateDataException` on matches.
- [ ] Implement referential checks: check if `departmentId` exists and `classroomId` exists. Throw `ResourceNotFoundException` on missing links.
- [ ] Set `status = "ACTIVE"` and `deleted = false`.
- [ ] Save the student document and convert result to response DTO.

## 4. Controller Layer
- [ ] Map endpoint `POST /api/v1/students` inside `StudentController`.
- [ ] Add `@Valid` annotation to request body parameter.
- [ ] Restrict access using `@PreAuthorize("hasRole('ADMIN')")`.

## 5. Verification & Testing
- [ ] Write unit tests mapping success, duplicate validations, and missing department/classroom.
- [ ] Run `mvn test` and verify code coverage is `> 80%`.
