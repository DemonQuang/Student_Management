# Task Checklist: Input Validation

This checklist tracks the development tasks required to implement JSR-380 input validation.

---

## 1. Setup & Configuration
- [ ] Add `spring-boot-starter-validation` in `pom.xml`.

## 2. DTO Constraints Setup
- [ ] Add `@NotBlank` / `@NotNull` on DTO fields.
- [ ] Add `@Email` on email properties.
- [ ] Add `@Pattern` with regex constraints for phone numbers.
- [ ] Add `@Past` constraints on birthday properties.
- [ ] Configure custom message arguments on annotations (e.g. `message = "Email is required"`).

## 3. Controller Integration
- [ ] Add `@Valid` annotation to request body parameters inside Controller controllers.
