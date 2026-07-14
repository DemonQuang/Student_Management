# Task Checklist: Retrieve User List

This checklist tracks the development tasks required to implement the admin user list lookup endpoint (`GET /api/v1/users`).

---

## 1. Security Configuration
- [ ] Ensure security filter chain restricts `/api/v1/users/**` access to `ADMIN` roles only.
- [ ] Configure `AccessDeniedHandler` to translate role violations.

## 2. Service Layer
- [ ] Define `findAllUsers()` in `UserService`.
- [ ] Implement `findAllUsers()` in `UserServiceImpl`.
- [ ] Call repository to retrieve all users.
- [ ] Convert the list of `User` documents to `UserResponse` DTOs (omitting password properties).

## 3. Controller Layer
- [ ] Implement endpoint `GET /api/v1/users` inside `UserController`.
- [ ] Restrict access utilizing `@PreAuthorize("hasRole('ADMIN')")`.
- [ ] Return the list wrapped inside `ApiResponse`.

## 4. Verification & Testing
- [ ] Write service-level unit tests in `UserServiceTest`.
- [ ] Verify endpoint block behavior on `USER` accounts and unauthenticated requests.
