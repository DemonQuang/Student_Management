# PRD: Search & Filter MongoDB Query Subtask

## 1. Overview & Goal
Build a dynamic query builder using Spring Data MongoDB `Query` and `Criteria` APIs to execute keyword searches and multi-attribute filters.

---

## 2. Functional Requirements
1. **Dynamic Mongo Querying**:
   - Instead of JPA Criteria, use `org.springframework.data.mongodb.core.query.Query` and `Criteria` to assemble database filters dynamically.
2. **Keyword Searching**:
   - Matches a `keyword` string parameter against:
     - `fullName` (regex partial match, case-insensitive: `(?i)keyword`)
     - `studentCode` (regex partial match, case-insensitive)
     - `email` (regex partial match, case-insensitive)
   - Combine these search conditions using an `orOperator`:
     ```java
     Criteria searchCriteria = new Criteria().orOperator(
         Criteria.where("fullName").regex(keyword, "i"),
         Criteria.where("studentCode").regex(keyword, "i"),
         Criteria.where("email").regex(keyword, "i")
     );
     ```
3. **Multi-Criteria Filtering**:
   - Add filter criteria when values are provided:
     - `departmentId` matching referenced `ObjectId`
     - `classroomId` matching referenced `ObjectId`
     - `gender` matching exact string
     - `status` matching exact string
   - Combine filters using `andOperator`.
4. **Soft-Delete Guard**:
   - Every query execution must enforce: `Criteria.where("deleted").is(false)`.

---

## 3. Acceptance Criteria
- [ ] Querying without keyword or filters returns all active students (`deleted: false`).
- [ ] Keyword searches match occurrences inside the name, code, or email using regex.
- [ ] Combining filters (e.g. `gender = FEMALE` AND `departmentId = ObjectId("...")`) queries database matching both.
- [ ] Soft-deleted students are excluded from query results.
