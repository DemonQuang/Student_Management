# Task Checklist: Delete User

This checklist tracks the development tasks required to implement the user account removal endpoint (`DELETE /api/v1/users/{id}`).

---

## 1. Service Layer
- [ ] Define `deleteUser(String id)` in `UserService`.
- [ ] Implement `deleteUser()` in `UserServiceImpl`.
- [ ] Fetch User from database by `id`. If missing, throw `ResourceNotFoundException`.
- [ ] Delete User document using `userRepository.deleteById(id)` (or toggle `enabled = false`).

## 2. Controller Layer
- [ ] Implement endpoint `DELETE /api/v1/users/{id}` inside `UserController`.
- [ ] Restrict access using `@PreAuthorize("hasRole('ADMIN')")`.
- [ ] Return success message inside `ApiResponse`.

## 3. Verification & Testing
- [ ] Write unit tests asserting user delete success and user missing scenarios.
- [ ] Verify endpoint block behavior on `USER` accounts.
