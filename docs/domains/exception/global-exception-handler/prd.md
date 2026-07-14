# PRD: Global Exception Handler Subtask

## 1. Overview & Goal
Establish a centralized exception handling layer to translate Java exceptions into consistent, user-friendly JSON payloads with appropriate HTTP status codes.

---

## 2. Functional Requirements
1. **Central Handler**: Annotate a configuration handler class with `@RestControllerAdvice`.
2. **Exception Interceptors**:
   - Write `@ExceptionHandler` methods to catch specific exceptions:
     - `MethodArgumentNotValidException` -> HTTP 400 Bad Request
     - `ResourceNotFoundException` -> HTTP 404 Not Found
     - `DuplicateDataException` -> HTTP 409 Conflict
     - `AuthenticationException` -> HTTP 401 Unauthorized
     - `AccessDeniedException` -> HTTP 403 Forbidden
     - General `Exception` (catch-all) -> HTTP 500 Internal Server Error
3. **Response Payload Template**:
   - Success flag (`success = false`)
   - Error message summary (`message`)
   - Optional detailed error mappings (`errors`) - particularly for validation errors.

---

## 3. Acceptance Criteria
- [ ] Any exception thrown in the service or database layer is caught by the handler.
- [ ] No raw stack traces are sent back to the API client.
- [ ] Errors consistently return the designated JSON response format.
- [ ] HTTP response codes correspond correctly to the mapped exception type.
