package com.studentmanagement.studentapi.service;

import com.studentmanagement.studentapi.dto.request.StudentRequest;
import com.studentmanagement.studentapi.dto.response.PageResponse;
import com.studentmanagement.studentapi.dto.response.StudentResponse;

public interface StudentService {
    StudentResponse createStudent(StudentRequest request);
    StudentResponse updateStudent(String id, StudentRequest request);
    StudentResponse getStudentById(String id);
    void deleteStudent(String id); // Soft Delete
    
    // API truy vấn nâng cao
    PageResponse<StudentResponse> getAllStudentsPaginated(int pageNo, int pageSize, String sortBy, String sortDir);
    PageResponse<StudentResponse> searchStudents(String keyword, int pageNo, int pageSize, String sortBy, String sortDir);
    PageResponse<StudentResponse> filterStudents(String departmentId, String classroomId, String gender, String status, String email, int pageNo, int pageSize, String sortBy, String sortDir);
}
