# PRD: Query Student Subtask

## 1. Overview & Goal
Enable users to query the list of active students using filters, search terms, sorting, and pagination.

---

## 2. User Story
As a user (both ADMIN and USER roles), I want to search, filter, paginate, and sort the student list so that I can easily find and view student directories.

---

## 3. Functional Requirements

### API Specification
- **Endpoints**:
  - `GET /api/v1/students`: Retrieves a paginated list of students.
  - `GET /api/v1/students/{id}`: Retrieves details of a single student.
  - `GET /api/v1/students/search`: Searches students by keyword.
  - `GET /api/v1/students/filter`: Filters students by multi-criteria.
- **Authentication**: Yes (`USER` or `ADMIN` role)

### Query Parameters

#### Paginated List (`GET /api/v1/students`)
- `page` (integer, default `0`): 0-indexed page number.
- `size` (integer, default `10`): Items count per page.
- `sort` (string, default `id`): Sort column.
- `direction` (string, default `asc`): Sort direction (`asc` or `desc`).

#### Search (`GET /api/v1/students/search`)
- `keyword` (string, required): Text matched against `fullName` (partial), `studentCode` (exact/partial), and `email` (partial/exact). Case-insensitive.

#### Filter (`GET /api/v1/students/filter`)
- `departmentId` (string/ObjectId, optional)
- `classroomId` (string/ObjectId, optional)
- `gender` (string, optional: `MALE`, `FEMALE`, `OTHER`)
- `status` (string, optional: `ACTIVE`, `INACTIVE`, `GRADUATED`, `SUSPENDED`)

### Process Logic
1. Validate incoming query parameters.
2. Build database query dynamically using Spring Data MongoDB Query and Criteria.
3. **Mandatory Constraint**: Always append `deleted = false` to ensure soft-deleted records are never returned.
4. Execute query and return the list or paginated response.

### Expected Outputs
- **Success (200 OK)**: Returns the matching students. Paginated lists include page metadata (total elements, total pages, page number).
- **Fail (400 Bad Request)**: If query parameters fail basic validation (e.g. negative page size).

---

## 4. Acceptance Criteria
- [ ] Invoking `GET /api/v1/students` returns HTTP 200 with standard page metadata.
- [ ] Searching with a keyword returns only students whose code, name, or email contains the keyword.
- [ ] Filtering on combinations of status, gender, classroom, or department returns matching students.
- [ ] Soft-deleted students are omitted from all search, filter, and page results.
- [ ] Unauthenticated requests are blocked with HTTP 401.
