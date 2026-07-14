package com.studentmanagement.studentapi.config;

import com.studentmanagement.studentapi.entity.Classroom;
import com.studentmanagement.studentapi.entity.Department;
import com.studentmanagement.studentapi.entity.Student;
import com.studentmanagement.studentapi.entity.User;
import com.studentmanagement.studentapi.repository.ClassroomRepository;
import com.studentmanagement.studentapi.repository.DepartmentRepository;
import com.studentmanagement.studentapi.repository.StudentRepository;
import com.studentmanagement.studentapi.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.StreamSupport;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, DepartmentRepository departmentRepository,
                      ClassroomRepository classroomRepository, StudentRepository studentRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.classroomRepository = classroomRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedDepartments();
        seedStudentUser();
    }

    private void seedAdminUser() {
        // Remove duplicate admin users (if any from previous runs)
        List<User> allAdmins = StreamSupport.stream(userRepository.findAll().spliterator(), false)
                .filter(u -> "admin".equals(u.getUsername()))
                .toList();
        if (allAdmins.size() > 1) {
            allAdmins.stream().skip(1).forEach(userRepository::delete);
        }

        userRepository.findByUsername("admin").ifPresentOrElse(
            user -> {
                if (!"ADMIN".equals(user.getRole())) {
                    user.setRole("ADMIN");
                    userRepository.save(user);
                    System.out.println("--> Promoted user 'admin' to ADMIN role!");
                }
            },
            () -> {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Administrator")
                        .email("admin@studentmgmt.com")
                        .role("ADMIN")
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                System.out.println("--> Created default ADMIN user: admin / admin123");
            }
        );
    }

    private void seedDepartments() {
        if (departmentRepository.count() > 0) return;

        Department dept1 = departmentRepository.save(
                Department.builder().name("Công nghệ thông tin").build());
        Department dept2 = departmentRepository.save(
                Department.builder().name("Kinh tế").build());
        Department dept3 = departmentRepository.save(
                Department.builder().name("Công nghệ thực phẩm").build());

        System.out.println("--> Seeded 3 departments");

        Classroom c1 = classroomRepository.save(
                Classroom.builder().name("CNTT-K46").departmentId(dept1.getId()).active(true).build());
        classroomRepository.save(
                Classroom.builder().name("CNTT-K47").departmentId(dept1.getId()).active(true).build());
        Classroom c3 = classroomRepository.save(
                Classroom.builder().name("KT-K46").departmentId(dept2.getId()).active(true).build());
        classroomRepository.save(
                Classroom.builder().name("TP-K46").departmentId(dept3.getId()).active(true).build());

        System.out.println("--> Seeded 4 classrooms");

        studentRepository.save(Student.builder()
                .studentCode("SV-2026-001")
                .fullName("Nguyễn Văn A")
                .email("sv01@student.edu.vn")
                .phone("0912345678")
                .birthday(LocalDate.of(2004, 5, 15))
                .gender("MALE")
                .address("Hà Nội")
                .status("ACTIVE")
                .departmentId(dept1.getId())
                .classroomId(c1.getId())
                .deleted(false)
                .build());
        System.out.println("--> Seeded student: SV-2026-001 - Nguyễn Văn A");
    }

    private void seedStudentUser() {
        if (userRepository.existsByEmail("sv01@student.edu.vn")) return;

        userRepository.save(User.builder()
                .username("sv01")
                .password(passwordEncoder.encode("123456"))
                .fullName("Nguyễn Văn A")
                .email("sv01@student.edu.vn")
                .role("USER")
                .enabled(true)
                .build());
        System.out.println("--> Created student user: sv01 / 123456");
    }
}
