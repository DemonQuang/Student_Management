package com.studentmanagement.studentapi.service.impl;

import com.studentmanagement.studentapi.dto.request.StudentRequest;
import com.studentmanagement.studentapi.dto.response.PageResponse;
import com.studentmanagement.studentapi.dto.response.StudentResponse;
import com.studentmanagement.studentapi.entity.Classroom;
import com.studentmanagement.studentapi.entity.Student;
import com.studentmanagement.studentapi.exception.BadRequestException;
import com.studentmanagement.studentapi.exception.DuplicateDataException;
import com.studentmanagement.studentapi.exception.ResourceNotFoundException;
import com.studentmanagement.studentapi.repository.ClassroomRepository;
import com.studentmanagement.studentapi.repository.DepartmentRepository;
import com.studentmanagement.studentapi.repository.StudentRepository;
import com.studentmanagement.studentapi.repository.UserRepository;
import com.studentmanagement.studentapi.service.StudentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepository;

    @Override
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByStudentCode(request.getStudentCode())) {
            throw new DuplicateDataException("Student code already exists: " + request.getStudentCode());
        }
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateDataException("Email already exists: " + request.getEmail());
        }
        if (studentRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateDataException("Phone number already exists: " + request.getPhone());
        }

        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email " + request.getEmail() + " chưa được đăng ký tài khoản người dùng");
        }

        if (!departmentRepository.existsById(request.getDepartmentId())) {
            throw new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId());
        }

        List<String> classroomIds = request.getClassroomIds();
        if (!CollectionUtils.isEmpty(classroomIds)) {
            for (String cid : classroomIds) {
                Classroom classroom = classroomRepository.findById(cid)
                        .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + cid));
                if (!classroom.getDepartmentId().equals(request.getDepartmentId())) {
                    throw new BadRequestException("Classroom " + cid + " does not belong to the selected Department");
                }
            }
        }

        Student student = Student.builder()
                .studentCode(request.getStudentCode())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .birthday(request.getBirthday())
                .gender(request.getGender())
                .address(request.getAddress())
                .status(request.getStatus())
                .departmentId(request.getDepartmentId())
                .classroomIds(classroomIds)
                .avatar(request.getAvatar())
                .deleted(false)
                .build();

        Student savedStudent = studentRepository.save(student);
        log.info("Created student code: {} - ID: {}", savedStudent.getStudentCode(), savedStudent.getId());

        return mapToResponse(savedStudent);
    }

    @Override
    public StudentResponse updateStudent(String id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        Query emailQuery = new Query(Criteria.where("email").is(request.getEmail()).and("id").ne(id));
        if (mongoTemplate.exists(emailQuery, Student.class)) {
            throw new DuplicateDataException("Email already exists: " + request.getEmail());
        }

        Query phoneQuery = new Query(Criteria.where("phone").is(request.getPhone()).and("id").ne(id));
        if (mongoTemplate.exists(phoneQuery, Student.class)) {
            throw new DuplicateDataException("Phone number already exists: " + request.getPhone());
        }

        if (!departmentRepository.existsById(request.getDepartmentId())) {
            throw new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId());
        }

        List<String> classroomIds = request.getClassroomIds();
        if (!CollectionUtils.isEmpty(classroomIds)) {
            for (String cid : classroomIds) {
                Classroom classroom = classroomRepository.findById(cid)
                        .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + cid));
                if (!classroom.getDepartmentId().equals(request.getDepartmentId())) {
                    throw new BadRequestException("Classroom " + cid + " does not belong to the selected Department");
                }
            }
        }

        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setBirthday(request.getBirthday());
        student.setGender(request.getGender());
        student.setAddress(request.getAddress());
        student.setStatus(request.getStatus());
        student.setDepartmentId(request.getDepartmentId());
        student.setClassroomIds(classroomIds);
        student.setAvatar(request.getAvatar());

        Student updatedStudent = studentRepository.save(student);
        log.info("Updated student ID: {}", id);

        return mapToResponse(updatedStudent);
    }

    @Override
    public StudentResponse getStudentById(String id) {
        Student student = studentRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToResponse(student);
    }

    @Override
    public void deleteStudent(String id) {
        Student student = studentRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        student.setDeleted(true);
        studentRepository.save(student);
        log.info("Soft-deleted student ID: {}", id);
    }

    @Override
    public PageResponse<StudentResponse> getAllStudentsPaginated(int pageNo, int pageSize, String sortBy, String sortDir) {
        Query query = new Query();
        query.addCriteria(Criteria.where("deleted").is(false));
        return executeQuery(query, pageNo, pageSize, sortBy, sortDir);
    }

    @Override
    public PageResponse<StudentResponse> searchStudents(String keyword, int pageNo, int pageSize, String sortBy, String sortDir) {
        Query query = new Query();
        query.addCriteria(Criteria.where("deleted").is(false));

        if (StringUtils.hasText(keyword)) {
            String regexPattern = ".*" + keyword + ".*";
            Criteria keywordCriteria = new Criteria().orOperator(
                    Criteria.where("fullName").regex(regexPattern, "i"),
                    Criteria.where("studentCode").regex(regexPattern, "i"),
                    Criteria.where("email").regex(regexPattern, "i")
            );
            query.addCriteria(keywordCriteria);
        }

        return executeQuery(query, pageNo, pageSize, sortBy, sortDir);
    }

    @Override
    public PageResponse<StudentResponse> filterStudents(String departmentId, String classroomId, String gender, String status, String email, int pageNo, int pageSize, String sortBy, String sortDir) {
        Query query = new Query();
        query.addCriteria(Criteria.where("deleted").is(false));

        List<Criteria> filters = new ArrayList<>();

        if (StringUtils.hasText(departmentId)) {
            filters.add(Criteria.where("departmentId").is(departmentId));
        }
        if (StringUtils.hasText(classroomId)) {
            Criteria classroomCriteria = new Criteria().orOperator(
                Criteria.where("classroomIds").is(classroomId),
                Criteria.where("classroomId").is(classroomId)
            );
            filters.add(classroomCriteria);
        }
        if (StringUtils.hasText(gender)) {
            filters.add(Criteria.where("gender").is(gender));
        }
        if (StringUtils.hasText(status)) {
            filters.add(Criteria.where("status").is(status));
        }
        if (StringUtils.hasText(email)) {
            filters.add(Criteria.where("email").is(email));
        }

        if (!filters.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(filters.toArray(new Criteria[0])));
        }

        return executeQuery(query, pageNo, pageSize, sortBy, sortDir);
    }

    private PageResponse<StudentResponse> executeQuery(Query query, int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir != null ? sortDir.toLowerCase() : "asc");
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(direction, sortBy));

        long totalElements = mongoTemplate.count(query, Student.class);

        query.with(pageable);
        List<Student> students = mongoTemplate.find(query, Student.class);

        List<StudentResponse> content = students.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        boolean last = pageNo >= totalPages - 1;

        return PageResponse.<StudentResponse>builder()
                .content(content)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .last(last)
                .build();
    }

    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .phone(student.getPhone())
                .birthday(student.getBirthday())
                .gender(student.getGender())
                .address(student.getAddress())
                .status(student.getStatus())
                .departmentId(student.getDepartmentId())
                .classroomIds(student.getClassroomIds() != null && !student.getClassroomIds().isEmpty()
                    ? student.getClassroomIds()
                    : (student.getClassroomId() != null ? List.of(student.getClassroomId()) : Collections.emptyList()))
                .avatar(student.getAvatar())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .createdBy(student.getCreatedBy())
                .updatedBy(student.getUpdatedBy())
                .build();
    }
}
