# Task Checklist: Global Exception Handler

This checklist tracks the development tasks required to implement the centralized exception handling layer.

---

## 1. Custom Exceptions
- [ ] Create `ResourceNotFoundException` class extending `RuntimeException`.
- [ ] Create `DuplicateDataException` class extending `RuntimeException`.

## 2. Response DTO
- [ ] Create `ErrorResponse` DTO containing `success` (false) and `message`.
- [ ] Create `ValidationErrorResponse` DTO containing `success` (false), `message`, and `errors` map.

## 3. Exception Handler class
- [ ] Create `GlobalExceptionHandler` annotated with `@RestControllerAdvice`.
- [ ] Inject SLF4J logger using Lombok `@Slf4j`.
- [ ] Add handler method for `ResourceNotFoundException` returning HTTP 404.
- [ ] Add handler method for `DuplicateDataException` returning HTTP 409.
- [ ] Add handler method for `MethodArgumentNotValidException` parsing validation errors and returning HTTP 400.
- [ ] Add handler method for `AccessDeniedException` returning HTTP 403.
- [ ] Add fallback handler method for `Exception` returning HTTP 500.
