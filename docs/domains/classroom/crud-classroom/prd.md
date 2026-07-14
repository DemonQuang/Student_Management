# PRD: CRUD Classroom Subtask

## 1. Overview & Goal
Provide full CRUD capability for academic Classrooms. Enforce referential checks to parent Departments and protect classrooms with enrolled students from deletion.

---

## 2. User Story
As an administrator, I want to create, read, update, and delete classrooms so that I can organize student groups under departments.

---

## 3. Functional Requirements

### API Specification
- `GET /api/v1/classrooms`: Retrieve all classrooms (USER, ADMIN).
- `GET /api/v1/classrooms/{id}`: Retrieve classroom by ID (USER, ADMIN).
- `POST /api/v1/classrooms`: Create a classroom (ADMIN only).
- `PUT /api/v1/classrooms/{id}`: Update a classroom (ADMIN only).
- `DELETE /api/v1/classrooms/{id}`: Delete a classroom (ADMIN only).

### Input Validation
- `name`: Required, cannot be blank.
- `departmentId`: Required, must exist in database.

### Process Logic

#### Create (`POST`) & Update (`PUT`)
1. Validate inputs. Check that `name` is provided.
2. Verify that the parent `departmentId` exists. If not, return HTTP 400 Bad Request.
3. Save to database. Auto-generate ID and assign audit details.

#### Delete (`DELETE`)
1. Retrieve Classroom by `id`. If not found, return 404.
2. Query Database to check if there are any active Students belonging to this `classroomId`. (Students with `deleted = false`).
3. **Delete Cascade Protection**:
   - If active students exist, throw error and return HTTP 400 Bad Request.
   - If no active students exist, hard delete the Classroom from the database.

### Expected Outputs
- **Success (200 OK / 201 Created)**: Returns the classroom data or deletion confirmation.
- **Fail (400 Bad Request)**: Invalid department reference, missing fields, or delete constraint validation failure.
- **Fail (404 Not Found)**: If target classroom ID does not exist.

---

## 4. Acceptance Criteria
- [ ] Creating a classroom with a non-existent `departmentId` returns HTTP 400 Bad Request.
- [ ] Attempting to delete a classroom containing active students returns HTTP 400.
- [ ] Deleting an empty classroom returns HTTP 200 and removes the record from the database.
- [ ] Non-admin write operations return HTTP 403 Forbidden.
