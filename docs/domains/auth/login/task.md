# Task Checklist: User Login & JWT Generation

This checklist tracks the development tasks required to implement the user authentication endpoint (`POST /api/v1/auth/login`).

---

## 1. Model & Validation DTOs
- [ ] Create `LoginRequest` DTO containing `username` and `password`.
- [ ] Apply `@NotBlank` annotations to `LoginRequest` DTO fields.
- [ ] Create `LoginResponse` DTO containing `accessToken`, `tokenType`, `expiresIn`, and `role`.

## 2. Configuration & Utilities
- [ ] Import `jjwt` (or equivalent JWT library) in `pom.xml`.
- [ ] Define helper keys in `application.properties` (`security.jwt.secret`, `security.jwt.expiration`).
- [ ] Create `JwtTokenProvider` class containing token generation and signing algorithms.

## 3. Security & User Details Implementation
- [ ] Implement `UserDetails` and `GrantedAuthority` interfaces mapping custom User database documents.
- [ ] Implement `UserDetailsService` to fetch user credentials from MongoDB by username.
- [ ] Set password verification checks inside `AuthenticationManager` configuration beans.

## 4. Controller Layer
- [ ] Map endpoint `POST /api/v1/auth/login` in `AuthController`.
- [ ] Add `@Valid` annotation to request body parameter.
- [ ] Call `AuthenticationManager.authenticate(...)` to verify credentials.
- [ ] Generate JWT and wrap the result in `LoginResponse`.

## 5. Verification & Testing
- [ ] Write unit tests mapping correct login, invalid passwords, and missing users in `AuthenticationServiceTest`.
- [ ] Run `mvn test` and verify code coverage is `> 80%`.
- [ ] Verify endpoint response using Swagger or Postman.
