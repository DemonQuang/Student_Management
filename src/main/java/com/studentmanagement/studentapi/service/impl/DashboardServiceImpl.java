package com.studentmanagement.studentapi.service.impl;

import com.studentmanagement.studentapi.dto.response.DashboardResponse;
import com.studentmanagement.studentapi.dto.response.DashboardResponse.DepartmentDistribution;
import com.studentmanagement.studentapi.dto.response.DashboardResponse.GenderDistribution;
import com.studentmanagement.studentapi.dto.response.DashboardResponse.RecentStudent;
import com.studentmanagement.studentapi.dto.response.DashboardResponse.StatusDistribution;
import com.studentmanagement.studentapi.entity.Classroom;
import com.studentmanagement.studentapi.entity.Department;
import com.studentmanagement.studentapi.entity.Student;
import com.studentmanagement.studentapi.entity.User;
import com.studentmanagement.studentapi.repository.ClassroomRepository;
import com.studentmanagement.studentapi.repository.DepartmentRepository;
import com.studentmanagement.studentapi.repository.StudentRepository;
import com.studentmanagement.studentapi.repository.UserRepository;
import com.studentmanagement.studentapi.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public DashboardResponse getDashboardData() {
        List<Student> students = studentRepository.findAll().stream()
                .filter(s -> !s.isDeleted())
                .toList();

        List<Department> departments = departmentRepository.findAll();
        List<Classroom> classrooms = classroomRepository.findAll();
        List<User> users = userRepository.findAll();

        Map<String, String> departmentMap = departments.stream()
                .collect(Collectors.toMap(Department::getId, Department::getName));

        List<DepartmentDistribution> departmentDistribution = students.stream()
                .collect(Collectors.groupingBy(Student::getDepartmentId, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> DepartmentDistribution.builder()
                        .departmentId(entry.getKey())
                        .departmentName(departmentMap.getOrDefault(entry.getKey(), "Unknown"))
                        .count(entry.getValue())
                        .build())
                .toList();

        List<StatusDistribution> statusDistribution = students.stream()
                .collect(Collectors.groupingBy(Student::getStatus, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> StatusDistribution.builder()
                        .status(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .toList();

        List<GenderDistribution> genderDistribution = students.stream()
                .collect(Collectors.groupingBy(Student::getGender, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> GenderDistribution.builder()
                        .gender(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .toList();

        List<RecentStudent> recentStudents = students.stream()
                .sorted(Comparator.comparing(Student::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .map(student -> RecentStudent.builder()
                        .id(student.getId())
                        .studentCode(student.getStudentCode())
                        .fullName(student.getFullName())
                        .departmentName(departmentMap.getOrDefault(student.getDepartmentId(), "Unknown"))
                        .status(student.getStatus())
                        .createdAt(student.getCreatedAt())
                        .build())
                .toList();

        return DashboardResponse.builder()
                .totalStudents(students.size())
                .totalDepartments(departments.size())
                .totalClassrooms(classrooms.size())
                .totalUsers(users.size())
                .departmentDistribution(departmentDistribution)
                .statusDistribution(statusDistribution)
                .genderDistribution(genderDistribution)
                .recentStudents(recentStudents)
                .build();
    }
}
