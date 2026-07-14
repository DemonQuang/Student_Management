package com.studentmanagement.studentapi.service;

import com.studentmanagement.studentapi.dto.request.DepartmentRequest;
import com.studentmanagement.studentapi.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse createDepartment(DepartmentRequest request);
    DepartmentResponse updateDepartment(String id, DepartmentRequest request);
    List<DepartmentResponse> getAllDepartments();
    DepartmentResponse getDepartmentById(String id);
    void deleteDepartment(String id);
}
