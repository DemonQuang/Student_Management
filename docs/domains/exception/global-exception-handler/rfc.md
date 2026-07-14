# RFC: Global Exception Handler Design

## 1. Technical Objective
Specify centralized exception mapping, custom exception classes, and response structures using Spring `@RestControllerAdvice`.

---

## 2. Component Design & Methods

### central Exception Handler (`GlobalExceptionHandler`)
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                             .body(new ErrorResponse(false, ex.getMessage()));
    }

    @ExceptionHandler(DuplicateDataException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateDataException ex) {
        log.warn("Conflict detected: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                             .body(new ErrorResponse(false, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        log.warn("Payload validation failed. Violations count: {}", errors.size());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(new ValidationErrorResponse(false, "Validation failed", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        log.error("Internal Server Error occurred", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(new ErrorResponse(false, "An internal server error occurred"));
    }
}
```

---

## 3. Custom Exception Signatures

```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class DuplicateDataException extends RuntimeException {
    public DuplicateDataException(String message) {
        super(message);
    }
}
```
*(Custom exceptions are thrown in the service layer when business assertions fail).*
