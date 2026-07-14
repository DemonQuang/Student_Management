# RFC: Input Validation Design

## 1. Technical Objective
Specify validation constraints, DTO annotations, and response intercept patterns using Spring Validation.

---

## 2. Model Validation Specifications

### `StudentCreateRequest`
```java
public class StudentCreateRequest {

    @NotBlank(message = "Student code is required")
    private String studentCode;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotNull(message = "Birthday is required")
    @Past(message = "Birthday must be in the past")
    private LocalDate birthday;

    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "^(MALE|FEMALE|OTHER)$", message = "Gender must be MALE, FEMALE, or OTHER")
    private String gender;

    private String address;

    @NotBlank(message = "Department ID is required")
    private String departmentId;

    @NotBlank(message = "Classroom ID is required")
    private String classroomId;
}
```

---

## 3. Controller Trigger Pattern

Controller actions intercept request parameters by utilizing `@Valid`:

```java
@PostMapping("/students")
public ResponseEntity<ApiResponse<StudentResponse>> createStudent(
    @Valid @RequestBody StudentCreateRequest request) {
    StudentResponse data = studentService.createStudent(request);
    return ResponseEntity.status(HttpStatus.CREATED)
                         .body(new ApiResponse<>(true, "Student created successfully", data));
}
```
*(If payload fields violate constraints, a `MethodArgumentNotValidException` is thrown before reaching service layers, which is handled globally).*
