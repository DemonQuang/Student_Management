package com.studentmanagement.studentapi.service.impl;

import com.studentmanagement.studentapi.dto.request.ClassroomRequest;
import com.studentmanagement.studentapi.dto.response.ClassroomResponse;
import com.studentmanagement.studentapi.entity.Classroom;
import com.studentmanagement.studentapi.entity.Student;
import com.studentmanagement.studentapi.exception.BadRequestException;
import com.studentmanagement.studentapi.exception.ResourceNotFoundException;
import com.studentmanagement.studentapi.repository.ClassroomRepository;
import com.studentmanagement.studentapi.repository.DepartmentRepository;
import com.studentmanagement.studentapi.repository.StudentRepository;
import com.studentmanagement.studentapi.service.ClassroomService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ClassroomServiceImpl implements ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public ClassroomResponse createClassroom(ClassroomRequest request) {
        if (!departmentRepository.existsById(request.getDepartmentId())) {
            throw new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId());
        }

        Classroom classroom = Classroom.builder()
                .name(request.getName())
                .departmentId(request.getDepartmentId())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        Classroom savedClassroom = classroomRepository.save(classroom);
        log.info("Created classroom: {} in department: {}", savedClassroom.getName(), savedClassroom.getDepartmentId());

        return mapToResponse(savedClassroom);
    }

    @Override
    public ClassroomResponse updateClassroom(String id, ClassroomRequest request) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + id));

        if (!departmentRepository.existsById(request.getDepartmentId())) {
            throw new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId());
        }

        // Ràng buộc cập nhật: Cấm thay đổi khoa (departmentId) của lớp học nếu đã có sinh viên liên kết
        if (!classroom.getDepartmentId().equals(request.getDepartmentId())) {
            boolean hasStudents = studentRepository.existsByClassroomId(id) || studentRepository.existsByClassroomIdsContaining(id);
            if (hasStudents) {
                throw new BadRequestException("Cannot change department: There are students enrolled in this classroom.");
            }
        }

        classroom.setName(request.getName());
        classroom.setDepartmentId(request.getDepartmentId());
        classroom.setActive(request.getActive() != null ? request.getActive() : true);

        Classroom updatedClassroom = classroomRepository.save(classroom);
        log.info("Updated classroom ID: {} to name: {} and department: {}", id, updatedClassroom.getName(), updatedClassroom.getDepartmentId());

        return mapToResponse(updatedClassroom);
    }

    @Override
    public List<ClassroomResponse> getAllClassrooms() {
        return classroomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClassroomResponse getClassroomById(String id) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + id));
        return mapToResponse(classroom);
    }

    @Override
    public void deleteClassroom(String id) {
        Classroom classroom = classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + id));

        // Ràng buộc xóa: Chặn xóa lớp nếu còn sinh viên liên kết (kể cả active và soft-deleted)
        boolean hasStudents = studentRepository.existsByClassroomId(id) || studentRepository.existsByClassroomIdsContaining(id);
        if (hasStudents) {
            throw new BadRequestException("Cannot delete classroom: There are students enrolled in this classroom.");
        }

        classroomRepository.delete(classroom);
        log.info("Deleted classroom ID: {}", id);
    }

    @Override
    public List<ClassroomResponse> getClassroomsByDepartmentId(String departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Department not found with ID: " + departmentId);
        }
        return classroomRepository.findByDepartmentId(departmentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ClassroomResponse mapToResponse(Classroom classroom) {
        Query countQuery = new Query();
        countQuery.addCriteria(new Criteria().orOperator(
            Criteria.where("classroomId").is(classroom.getId()),
            Criteria.where("classroomIds").is(classroom.getId())
        ));
        countQuery.addCriteria(Criteria.where("deleted").is(false));
        long studentCount = mongoTemplate.count(countQuery, Student.class);
        return ClassroomResponse.builder()
                .id(classroom.getId())
                .name(classroom.getName())
                .departmentId(classroom.getDepartmentId())
                .active(classroom.getActive() != null ? classroom.getActive() : true)
                .studentCount(studentCount)
                .createdAt(classroom.getCreatedAt())
                .updatedAt(classroom.getUpdatedAt())
                .createdBy(classroom.getCreatedBy())
                .updatedBy(classroom.getUpdatedBy())
                .build();
    }
}
