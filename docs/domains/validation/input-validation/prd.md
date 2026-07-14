# PRD: Input Validation Subtask

## 1. Overview & Goal
Ensure incoming client requests contain valid, well-formed arguments before they reach service layer logic.

---

## 2. Functional Requirements
1. **Validation Engine**: Utilize Hibernate Validator integrated via `spring-boot-starter-validation`.
2. **DTO Constraint Setup**:
   - Apply standard JSR-380 annotations to request body fields:
     - `@NotNull` / `@NotBlank` (ensure values exist)
     - `@Email` (check structure)
     - `@Size` / `@Pattern` (length and regex checks, e.g. 10 digits for phones)
     - `@Past` (for birthdays)
3. **Triggering Checks**:
   - Annotate controller endpoints with `@Valid` on request bodies.
4. **Error Interception**:
   - Intercept `MethodArgumentNotValidException` using the Global Exception Handler and return a structured JSON response mapping field names to validation error messages.

---

## 3. Acceptance Criteria
- [ ] Submitting a request with missing required fields triggers a HTTP 400 Bad Request.
- [ ] The API response lists all validation violations grouped by field names.
- [ ] Valid requests bypass constraint checks cleanly and proceed to the service layer.
