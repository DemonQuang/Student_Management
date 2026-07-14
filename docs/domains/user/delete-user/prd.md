# PRD: Delete User Subtask

## 1. Overview & Goal
Enable administrators to remove user accounts from the system.

---

## 2. User Story
As an administrator, I want to delete a user's account so that they can no longer log in or access the application.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `DELETE /api/v1/users/{id}`
- **Authentication**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The User's ID)

### Process Logic
1. Validate authorization credentials (`ADMIN` role).
2. Fetch User by `id` from the database. If not found, return 404 Not Found.
3. Remove the User record from the database (hard delete) or deactivate the account (set `enabled = false`).
4. Save database status.

### Expected Outputs
- **Success (200 OK)**: Returns confirmation that the user was deleted successfully.
- **Fail (404 Not Found)**: If the target user ID does not exist.
- **Fail (403 Forbidden)**: If invoked by a non-admin.

---

## 4. Acceptance Criteria
- [ ] Deleting a valid user ID returns HTTP 200.
- [ ] Subsequent login requests for the deleted user fail with HTTP 401.
- [ ] Non-admin requests to delete a user are blocked with HTTP 403.
- [ ] Attempting to delete a non-existent user ID returns HTTP 404.
