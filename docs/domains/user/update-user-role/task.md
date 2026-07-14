# Task Checklist: Update User Role

This checklist tracks the development tasks required to implement the user role elevation/modification endpoint (`PUT /api/v1/users/{id}/role`).

---

## 1. Model & Validation DTOs
- [ ] Create `UpdateRoleRequest` DTO containing `role` string property.
- [ ] Add JSR-380 input validation annotations restricting `role` value to `ADMIN` or `USER`.

## 2. Service Layer
- [ ] Define `updateRole(String id, UpdateRoleRequest request)` in `UserService`.
- [ ] Implement `updateRole()` in `UserServiceImpl`.
- [ ] Retrieve user document from MongoDB. Throw `ResourceNotFoundException` if missing.
- [ ] Set User role property to request role.
- [ ] Save the updated User document and convert result to `UserResponse` DTO.

## 3. Controller Layer
- [ ] Implement endpoint `PUT /api/v1/users/{id}/role` inside `UserController`.
- [ ] Restrict access using `@PreAuthorize("hasRole('ADMIN')")`.
- [ ] Return the updated object inside `ApiResponse`.

## 4. Verification & Testing
- [ ] Write unit tests mapping correct role update, user missing, and invalid roles.
- [ ] Run `mvn test` and verify code coverage is `> 80%`.
