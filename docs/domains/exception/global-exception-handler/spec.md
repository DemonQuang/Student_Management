# Functional Specification: Global Exception Handler

## 1. Functional Overview
Provide unified error formats across all API requests, masking system execution trace logs and returning structured JSON payloads matching the error scenario.

---

## 2. HTTP Exception Mapping Specifications

### 400 Bad Request (Validation failure)
- **Cause**: Input validation constraints fail.
- **Payload**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email format is invalid"
  }
}
```

### 404 Not Found (Resource missing)
- **Cause**: Queried entity ID does not exist in MongoDB.
- **Payload**:
```json
{
  "success": false,
  "message": "Student not found with ID: 60c72b2f9b1d8b2bad999999"
}
```

### 409 Conflict (Duplicate data conflict)
- **Cause**: Uniqueness index constraints violated.
- **Payload**:
```json
{
  "success": false,
  "message": "Student code already exists"
}
```

### 401 Unauthorized / 403 Forbidden (Security rejects)
- **Cause**: JWT validation failure or role mismatch.
- **Payload**:
```json
{
  "success": false,
  "message": "Access Denied"
}
```

### 500 Internal Server Error (System failure)
- **Cause**: NullPointer, Database connection timeouts, or unhandled errors.
- **Payload**:
```json
{
  "success": false,
  "message": "An internal server error occurred"
}
```

---

## 3. Operational Workflow
- An exception is thrown in the Controller or Service.
- `@RestControllerAdvice` intercepts the exception.
- Evaluates the exception type, logs warnings (with stack traces for 500 status errors), and generates the HTTP response entity.
