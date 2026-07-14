package com.studentmanagement.studentapi.controller;

import com.studentmanagement.studentapi.dto.request.StudentRequest;
import com.studentmanagement.studentapi.dto.response.ApiResponse;
import com.studentmanagement.studentapi.dto.response.PageResponse;
import com.studentmanagement.studentapi.dto.response.StudentResponse;
import com.studentmanagement.studentapi.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@Valid @RequestBody StudentRequest request) {
        StudentResponse response = studentService.createStudent(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable String id,
            @Valid @RequestBody StudentRequest request) {
        StudentResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable String id) {
        StudentResponse response = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable String id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully (Soft delete)"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> getAllStudents(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "direction", defaultValue = "asc") String direction) {
        PageResponse<StudentResponse> response = studentService.getAllStudentsPaginated(page, size, sort, direction);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> searchStudents(
            @RequestParam(value = "keyword") String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "direction", defaultValue = "asc") String direction) {
        PageResponse<StudentResponse> response = studentService.searchStudents(keyword, page, size, sort, direction);
        return ResponseEntity.ok(ApiResponse.success("Students search executed successfully", response));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> filterStudents(
            @RequestParam(value = "departmentId", required = false) String departmentId,
            @RequestParam(value = "classroomId", required = false) String classroomId,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sort", defaultValue = "id") String sort,
            @RequestParam(value = "direction", defaultValue = "asc") String direction) {
        PageResponse<StudentResponse> response = studentService.filterStudents(
                departmentId, classroomId, gender, status, email, page, size, sort, direction);
        return ResponseEntity.ok(ApiResponse.success("Students filter executed successfully", response));
    }
}
