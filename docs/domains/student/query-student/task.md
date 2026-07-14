# Task Checklist: Query Student

This checklist tracks the development tasks required to implement pagination, sorting, keyword searches, and multi-criteria filters on student directories.

---

## 1. Repository & Helper Layers
- [ ] Create `findAllByDeletedFalse(Pageable pageable)` in `StudentRepository`.
- [ ] Setup helper classes/methods to construct dynamic queries using `MongoTemplate`.

## 2. Service Layer
- [ ] Define query, search, and filter methods in `StudentService`.
- [ ] Implement `getAllStudents(Pageable pageable)` in `StudentServiceImpl` (using `studentRepository.findAllByDeletedFalse`).
- [ ] Implement `searchAndFilterStudents()` inside `StudentServiceImpl` using `MongoTemplate` query predicates (ensuring `deleted = false` is always appended).
- [ ] Map output `Student` documents to `StudentResponse` DTO list/page objects.

## 3. Controller Layer
- [ ] Implement endpoint `GET /api/v1/students` inside `StudentController`.
- [ ] Implement endpoint `GET /api/v1/students/search` inside `StudentController`.
- [ ] Implement endpoint `GET /api/v1/students/filter` inside `StudentController`.
- [ ] Translate request parameters to Spring Data `Pageable` in controller.
- [ ] Restrict access using `@PreAuthorize("hasAnyRole('USER', 'ADMIN')")`.

## 4. Verification & Testing
- [ ] Write unit tests asserting correct sorting, pagination metadata, search keyword matching, and filter conditions.
- [ ] Verify that deleted students are excluded from query results.
