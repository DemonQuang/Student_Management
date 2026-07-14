# PRD: User Registration Subtask

## 1. Overview & Goal
Provide an endpoint allowing new users to register an account in the Student Management System. By default, newly registered users are assigned the `USER` role.

---

## 2. User Story
As an unregistered visitor, I want to create a new user account so that I can log in and view student directories.

---

## 3. Functional Requirements

### API Specification
- **Endpoint**: `POST /api/v1/auth/register`
- **Authentication**: None (Permit All)

### Input Validation
- `username`: Required, unique, length between 3 and 50 characters.
- `password`: Required, minimum 6 characters.
- `fullName`: Required, cannot be blank.
- `email`: Required, unique, must follow email format syntax.

### Process Logic
1. Validate inputs (JSR 380 annotations).
2. Check if the `username` or `email` already exists in the database. If so, return a 409 Conflict.
3. Hash the `password` using BCrypt before storing.
4. Set the default user role to `USER` and account status `enabled = true`.
5. Persist the new User entity to the database.

### Expected Outputs
- **Success (201 Created)**: Returns the registered user details (excluding password hash) in a JSON payload.
- **Fail (400 Bad Request)**: Validation error listing invalid fields.
- **Fail (409 Conflict)**: Error message explaining that the username or email is already taken.

---

## 4. Acceptance Criteria
- [ ] Invoking `POST /api/v1/auth/register` with valid parameters returns HTTP 201.
- [ ] Database contains the new user record with a BCrypt-encrypted password hash.
- [ ] Re-registering with the same username or email returns HTTP 409 Conflict.
- [ ] Invoking registration with empty fields returns HTTP 400 Bad Request.
