package com.studentmanagement.studentapi.controller;

import com.studentmanagement.studentapi.dto.request.ClassroomRequest;
import com.studentmanagement.studentapi.dto.response.ApiResponse;
import com.studentmanagement.studentapi.dto.response.ClassroomResponse;
import com.studentmanagement.studentapi.service.ClassroomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClassroomResponse>> createClassroom(@Valid @RequestBody ClassroomRequest request) {
        ClassroomResponse response = classroomService.createClassroom(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Classroom created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomResponse>> updateClassroom(
            @PathVariable String id,
            @Valid @RequestBody ClassroomRequest request) {
        ClassroomResponse response = classroomService.updateClassroom(id, request);
        return ResponseEntity.ok(ApiResponse.success("Classroom updated successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassroomResponse>>> getAllClassrooms() {
        List<ClassroomResponse> response = classroomService.getAllClassrooms();
        return ResponseEntity.ok(ApiResponse.success("Classrooms retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomResponse>> getClassroomById(@PathVariable String id) {
        ClassroomResponse response = classroomService.getClassroomById(id);
        return ResponseEntity.ok(ApiResponse.success("Classroom retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClassroom(@PathVariable String id) {
        classroomService.deleteClassroom(id);
        return ResponseEntity.ok(ApiResponse.success("Classroom deleted successfully"));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<ClassroomResponse>>> getClassroomsByDepartmentId(@PathVariable String departmentId) {
        List<ClassroomResponse> response = classroomService.getClassroomsByDepartmentId(departmentId);
        return ResponseEntity.ok(ApiResponse.success("Classrooms for department retrieved successfully", response));
    }
}
