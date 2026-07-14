# PRD: Update User Role Subtask

## 1. Overview & Goal
Enable administrators to promote or demote users by updating their role assignment.

---

## 2. User Story
As an administrator, I want to change a user's role (e.g. from `USER` to `ADMIN`) so that I can grant them appropriate access levels.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `PUT /api/v1/users/{id}/role`
- **Authentication**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The User's ID)

### Input Validation
- Request Body must contain a valid `role` enum value (`ADMIN` or `USER`).

### Process Logic
1. Validate authorization credentials (`ADMIN` role).
2. Fetch User by `id` from the database. If not found, return 404 Not Found.
3. Update the `role` field on the User entity.
4. Save the modified User entity back to the database.

### Expected Outputs
- **Success (200 OK)**: Returns the updated User details.
- **Fail (404 Not Found)**: If the target user ID does not exist.
- **Fail (403 Forbidden)**: If invoked by a non-admin.

---

## 4. Acceptance Criteria
- [ ] Changing a user's role from USER to ADMIN via this endpoint succeeds with HTTP 200.
- [ ] Non-admin requests to this endpoint are blocked with HTTP 403.
- [ ] Attempting to update a non-existent user ID returns HTTP 404.
- [ ] Sending invalid role values (e.g., "SUPER_ADMIN") results in HTTP 400 Bad Request.
