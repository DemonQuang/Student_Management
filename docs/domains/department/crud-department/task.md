# Task Checklist: CRUD Department

This checklist tracks the development tasks required to implement full CRUD capability on academic Departments, including cascade deletion checks.

---

## 1. Model & Validation DTOs
- [ ] Create `DepartmentRequest` DTO containing `name`.
- [ ] Add `@NotBlank` annotation to `name` field.
- [ ] Create `DepartmentResponse` DTO mapping properties to return to clients.

## 2. Repository Layer
- [ ] Implement `existsByName(String name)` in `DepartmentRepository`.
- [ ] Implement `existsByDepartmentId(String departmentId)` in `ClassroomRepository` (used for cascade checks).

## 3. Service Layer
- [ ] Define CRUD methods in `DepartmentService`.
- [ ] Implement CRUD methods in `DepartmentServiceImpl`.
- [ ] On create/update: check if department name exists. Throw `DuplicateDataException` on matches.
- [ ] On delete:
  - Fetch department. Throw `ResourceNotFoundException` if missing.
  - Call `classroomRepository.existsByDepartmentId(id)`.
  - If classrooms exist, throw `ConstraintViolationException`.
  - If no classrooms exist, call `departmentRepository.deleteById(id)`.

## 4. Controller Layer
- [ ] Implement REST endpoints (`GET` list, `GET` by ID, `POST` create, `PUT` update, `DELETE` delete) in `DepartmentController`.
- [ ] Restrict access (write operations restricted to `ADMIN`, read operations allow `USER` and `ADMIN`).

## 5. Verification & Testing
- [ ] Write unit tests asserting creation success, duplication blocks, and cascade deletion protection.
- [ ] Run `mvn test` and verify code coverage is `> 80%`.
