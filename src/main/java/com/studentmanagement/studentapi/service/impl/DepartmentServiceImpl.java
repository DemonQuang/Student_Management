package com.studentmanagement.studentapi.service.impl;

import com.studentmanagement.studentapi.dto.request.DepartmentRequest;
import com.studentmanagement.studentapi.dto.response.DepartmentResponse;
import com.studentmanagement.studentapi.entity.Department;
import com.studentmanagement.studentapi.exception.BadRequestException;
import com.studentmanagement.studentapi.exception.DuplicateDataException;
import com.studentmanagement.studentapi.exception.ResourceNotFoundException;
import com.studentmanagement.studentapi.repository.ClassroomRepository;
import com.studentmanagement.studentapi.repository.DepartmentRepository;
import com.studentmanagement.studentapi.service.DepartmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new DuplicateDataException("Department name already exists");
        }

        Department department = Department.builder()
                .name(request.getName())
                .build();

        Department savedDepartment = departmentRepository.save(department);
        log.info("Created department: {}", savedDepartment.getName());

        return mapToResponse(savedDepartment);
    }

    @Override
    public DepartmentResponse updateDepartment(String id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        departmentRepository.findByName(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateDataException("Department name already exists");
            }
        });

        department.setName(request.getName());
        Department updatedDepartment = departmentRepository.save(department);
        log.info("Updated department ID: {} to name: {}", id, updatedDepartment.getName());

        return mapToResponse(updatedDepartment);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse getDepartmentById(String id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToResponse(department);
    }

    @Override
    public void deleteDepartment(String id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        if (classroomRepository.existsByDepartmentId(id)) {
            throw new BadRequestException("Cannot delete department: There are classrooms belonging to this department.");
        }

        departmentRepository.delete(department);
        log.info("Deleted department ID: {}", id);
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .createdAt(department.getCreatedAt())
                .updatedAt(department.getUpdatedAt())
                .createdBy(department.getCreatedBy())
                .updatedBy(department.getUpdatedBy())
                .build();
    }
}
