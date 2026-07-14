# Task Checklist: Delete Student (Soft Delete)

This checklist tracks the development tasks required to implement the student soft deletion endpoint (`DELETE /api/v1/students/{id}`).

---

## 1. Service Layer
- [ ] Define `deleteStudent(String id)` in `StudentService`.
- [ ] Implement `deleteStudent()` in `StudentServiceImpl`.
- [ ] Fetch student from database using `findByIdAndDeletedFalse(id)`. If missing, throw `ResourceNotFoundException`.
- [ ] Set `deleted = true` on the student entity.
- [ ] Save the updated student document using `studentRepository.save(student)`.

## 2. Controller Layer
- [ ] Implement endpoint `DELETE /api/v1/students/{id}` inside `StudentController`.
- [ ] Restrict access using `@PreAuthorize("hasRole('ADMIN')")`.
- [ ] Return success message inside `ApiResponse`.

## 3. Verification & Testing
- [ ] Write unit tests asserting soft-delete success and student missing scenarios in `StudentServiceTest`.
- [ ] Verify that deleted students are excluded from query lists.
