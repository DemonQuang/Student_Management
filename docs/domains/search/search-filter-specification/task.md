# Task Checklist: Search & Filter MongoDB Queries

This checklist tracks the development tasks required to implement dynamic queries using `MongoTemplate`.

---

## 1. Helper & Service Layer Setup
- [ ] Inject `MongoTemplate` bean into `StudentQueryServiceImpl`.
- [ ] Implement query assembly method.
- [ ] Setup soft delete criteria `deleted: false`.
- [ ] Setup regex-based criteria matching keyword strings on `fullName`, `studentCode`, and `email` using `orOperator`.
- [ ] Setup field-level criteria matching `departmentId`, `classroomId`, `gender`, and `status` using `andOperator`.
- [ ] Execute `mongoTemplate.find(query, Student.class)` and return the mapped DTO list.

## 2. Verification
- [ ] Perform manual testing to verify that keywords are matched case-insensitively.
- [ ] Verify that filters are ignored when values are null or empty.
