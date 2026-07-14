# PRD: CRUD Department Subtask

## 1. Overview & Goal
Provide full CRUD (Create, Read, Update, Delete) capability for academic Department records. Enforce protections against deleting departments that contain classrooms.

---

## 2. User Story
As an administrator, I want to create, read, update, and delete departments so that the academic divisions of the school are kept up to date.

---

## 3. Functional Requirements

### API Specification
- `GET /api/v1/departments`: Retrieve all departments (USER, ADMIN).
- `GET /api/v1/departments/{id}`: Retrieve department by ID (USER, ADMIN).
- `POST /api/v1/departments`: Create a department (ADMIN only).
- `PUT /api/v1/departments/{id}`: Update a department (ADMIN only).
- `DELETE /api/v1/departments/{id}`: Delete a department (ADMIN only).

### Process Logic

#### Create (`POST`) & Update (`PUT`)
1. Validate inputs (e.g. `name` is required and must be unique).
2. Save to database. Auto-generate ID (for creation) and assign audit details.

#### Delete (`DELETE`)
1. Retrieve Department by `id`. If not found, return 404.
2. Query Database to check if there are any Classrooms belonging to this `departmentId`.
3. **Delete Cascade Protection**:
   - If classrooms exist, throw `ConstraintViolationException` / return HTTP 400 Bad Request.
   - If no classrooms exist, perform a hard delete of the Department record from the database.

### Expected Outputs
- **Success (200 OK / 201 Created)**: Returns the department data or action confirmation.
- **Fail (400 Bad Request)**: Validation error or delete constraint validation failure (when classrooms exist).
- **Fail (404 Not Found)**: If trying to access or delete a department that does not exist.
- **Fail (409 Conflict)**: If creating/updating a department name that already exists.

---

## 4. Acceptance Criteria
- [ ] Invoking `POST /api/v1/departments` with an existing name returns HTTP 409 Conflict.
- [ ] Invoking `DELETE /api/v1/departments/{id}` on a department containing classrooms returns HTTP 400 with a clear error message.
- [ ] Invoking `DELETE /api/v1/departments/{id}` on an empty department deletes the record and returns HTTP 200.
- [ ] Non-admin requests for creation, update, or deletion return HTTP 403 Forbidden.
