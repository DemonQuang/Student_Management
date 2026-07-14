# Task Checklist: CRUD Classroom

This checklist tracks the development tasks required to implement full CRUD capability on academic Classrooms, including parent department validations and student deletion checks.

---

## 1. Model & Validation DTOs
- [ ] Create `ClassroomRequest` DTO containing `name` and `departmentId`.
- [ ] Add JSR-380 input validation annotations on DTO fields.
- [ ] Create `ClassroomResponse` DTO mapping classroom properties.

## 2. Repository Layer
- [ ] Implement `existsByClassroomIdAndDeletedFalse(String classroomId)` in `StudentRepository` (used for cascade checks).

## 3. Service Layer
- [ ] Define CRUD methods in `ClassroomService`.
- [ ] Implement CRUD methods in `ClassroomServiceImpl`.
- [ ] On create/update: check if parent `departmentId` exists. Throw `ResourceNotFoundException` if missing.
- [ ] On delete:
  - Fetch classroom. Throw `ResourceNotFoundException` if missing.
  - Call `studentRepository.existsByClassroomIdAndDeletedFalse(id)`.
  - If active students exist, throw `ConstraintViolationException`.
  - If no active students exist, call `classroomRepository.deleteById(id)`.

## 4. Controller Layer
- [ ] Implement REST endpoints (`GET` list, `GET` by ID, `POST` create, `PUT` update, `DELETE` delete) in `ClassroomController`.
- [ ] Restrict access (write operations restricted to `ADMIN`, read operations allow `USER` and `ADMIN`).

## 5. Verification & Testing
- [ ] Write unit tests asserting creation success, invalid department link, and deletion protection block.
- [ ] Run `mvn test` and verify code coverage is `> 80%`.
