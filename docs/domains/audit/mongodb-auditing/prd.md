# PRD: MongoDB Auditing Subtask

## 1. Overview & Goal
Enable Spring Data MongoDB Auditing to automatically capture creation/update times and modification users for all database documents.

---

## 2. Functional Requirements
1. **Auditor Context Provider**:
   - Implement `AuditorAware<String>`.
   - Retrieve the current authenticated user's username from Spring Security context:
     ```java
     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
     ```
   - Return username (e.g. `admin`, `user`) if authenticated, or a default string (e.g. `"system"`) if unauthenticated.
2. **Configuration**:
   - Enable auditing via `@EnableMongoAuditing` configuration annotation.
3. **Base Document Mapping**:
   - Create a base document structure (or define annotations directly on the entities).
   - Define fields:
     - `createdAt` annotated with `@CreatedDate`
     - `updatedAt` annotated with `@LastModifiedDate`
     - `createdBy` annotated with `@CreatedBy`
     - `updatedBy` annotated with `@LastModifiedBy`
   - Make sure all collection models (Student, Department, Classroom) contain these fields.

---

## 3. Acceptance Criteria
- [ ] Saving a new document automatically populates `createdAt` and `createdBy` fields in MongoDB.
- [ ] Modifying an existing document automatically updates `updatedAt` and `updatedBy` fields.
- [ ] No manual setter calls for audit fields should exist in service layer code.
- [ ] Audit values correctly reflect the authenticated user's name making the HTTP request.
