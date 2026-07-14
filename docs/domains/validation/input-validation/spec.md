# Functional Specification: Input Validation

## 1. Functional Overview
Intercept client payloads to validate constraint annotations before controllers delegate requests to service layers, ensuring invalid arguments trigger HTTP 400 with validation error details.

---

## 2. Validation Violation Scenarios

### Missing Field
- **Payload**: `{ "fullName": "" }`
- **Result**: HTTP 400 Bad Request.
- **JSON Response**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fullName": "Full name is required"
  }
}
```

### Invalid Format (Email/Phone)
- **Payload**: `{ "email": "invalid-email", "phone": "123" }`
- **Result**: HTTP 400 Bad Request.
- **JSON Response**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email format is invalid",
    "phone": "Phone number must be exactly 10 digits"
  }
}
```

### Invalid Date (Future Birthday)
- **Payload**: `{ "birthday": "2030-01-01" }`
- **Result**: HTTP 400 Bad Request.
- **JSON Response**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "birthday": "Birthday must be in the past"
  }
}
```

---

## 3. Operational Workflow

1. **Client Request**: Submits payload with incorrect properties.
2. **Spring Context Interception**:
   - The `@Valid` annotation intercepts the request.
   - Triggers validations defined on fields using JSR 380 annotations.
3. **Exception Trigger**:
   - Throw `MethodArgumentNotValidException`.
   - Central exception handler intercepts the exception and maps field-level violations to a clean JSON response.
