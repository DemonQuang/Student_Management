# Task Checklist: User Registration

This checklist tracks the development tasks required to implement the user registration endpoint (`POST /api/v1/auth/register`).

---

## 1. Model & Validation DTOs
- [ ] Create `RegisterRequest` DTO containing `username`, `password`, `fullName`, `email`.
- [ ] Apply JSR-380 annotations to `RegisterRequest` DTO fields (`@NotBlank`, `@Size`, `@Email`).
- [ ] Create `UserResponse` DTO mapped to safe properties (excluding password fields).

## 2. Repository Layer
- [ ] Implement `existsByUsername(String username)` in `UserRepository`.
- [ ] Implement `existsByEmail(String email)` in `UserRepository`.

## 3. Service Layer
- [ ] Define registration method in `AuthService` interface.
- [ ] Implement method in `UserServiceImpl` class.
- [ ] Add checks: call `existsByUsername` and throw `DuplicateDataException` if username is taken.
- [ ] Add checks: call `existsByEmail` and throw `DuplicateDataException` if email is taken.
- [ ] Inject `PasswordEncoder` bean to hash passwords using BCrypt.
- [ ] Assign default `"USER"` role and set `enabled = true`.
- [ ] Persist the User document and convert the result to `UserResponse` DTO.

## 4. Controller Layer
- [ ] Map endpoint `POST /api/v1/auth/register` in `AuthController`.
- [ ] Add `@Valid` annotation to request body parameter.
- [ ] Attach OpenAPI `@Operation` annotations for Swagger docs.

## 5. Verification & Testing
- [ ] Write unit tests mapping success and failure branches in `AuthServiceTest`.
- [ ] Run `mvn test` and verify code coverage is `> 80%`.
- [ ] Verify endpoint response using Swagger or Postman.
