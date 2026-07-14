package com.studentmanagement.studentapi.service;

import com.studentmanagement.studentapi.dto.request.StudentRequest;
import com.studentmanagement.studentapi.dto.response.StudentResponse;
import com.studentmanagement.studentapi.entity.Classroom;
import com.studentmanagement.studentapi.entity.Student;
import com.studentmanagement.studentapi.exception.BadRequestException;
import com.studentmanagement.studentapi.exception.DuplicateDataException;
import com.studentmanagement.studentapi.exception.ResourceNotFoundException;
import com.studentmanagement.studentapi.repository.ClassroomRepository;
import com.studentmanagement.studentapi.repository.DepartmentRepository;
import com.studentmanagement.studentapi.repository.StudentRepository;
import com.studentmanagement.studentapi.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private ClassroomRepository classroomRepository;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private StudentServiceImpl studentService;

    private StudentRequest studentRequest;
    private Student student;
    private Classroom classroom;

    @BeforeEach
    void setUp() {
        studentRequest = new StudentRequest();
        studentRequest.setStudentCode("SV001");
        studentRequest.setFullName("Nguyen Van A");
        studentRequest.setEmail("vana@gmail.com");
        studentRequest.setPhone("0912345678");
        studentRequest.setBirthday(LocalDate.of(2004, 1, 15));
        studentRequest.setGender("MALE");
        studentRequest.setStatus("ACTIVE");
        studentRequest.setDepartmentId("dept123");
        studentRequest.setClassroomIds(List.of("class123"));

        student = Student.builder()
                .id("stud123")
                .studentCode("SV001")
                .fullName("Nguyen Van A")
                .email("vana@gmail.com")
                .phone("0912345678")
                .birthday(LocalDate.of(2004, 1, 15))
                .gender("MALE")
                .status("ACTIVE")
                .departmentId("dept123")
                .classroomIds(List.of("class123"))
                .deleted(false)
                .build();

        classroom = Classroom.builder()
                .id("class123")
                .name("Class IT-01")
                .departmentId("dept123")
                .build();
    }

    @Test
    void createStudent_Success() {
        when(studentRepository.existsByStudentCode("SV001")).thenReturn(false);
        when(studentRepository.existsByEmail("vana@gmail.com")).thenReturn(false);
        when(studentRepository.existsByPhone("0912345678")).thenReturn(false);
        when(departmentRepository.existsById("dept123")).thenReturn(true);
        when(classroomRepository.findById("class123")).thenReturn(Optional.of(classroom));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentResponse response = studentService.createStudent(studentRequest);

        assertNotNull(response);
        assertEquals("SV001", response.getStudentCode());
        assertEquals("Nguyen Van A", response.getFullName());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void createStudent_DuplicateStudentCode_ThrowsDuplicateDataException() {
        when(studentRepository.existsByStudentCode("SV001")).thenReturn(true);

        assertThrows(DuplicateDataException.class, () -> studentService.createStudent(studentRequest));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void createStudent_ClassroomNotBelongToDepartment_ThrowsBadRequestException() {
        classroom.setDepartmentId("otherDept");
        when(studentRepository.existsByStudentCode("SV001")).thenReturn(false);
        when(studentRepository.existsByEmail("vana@gmail.com")).thenReturn(false);
        when(studentRepository.existsByPhone("0912345678")).thenReturn(false);
        when(departmentRepository.existsById("dept123")).thenReturn(true);
        when(classroomRepository.findById("class123")).thenReturn(Optional.of(classroom));

        assertThrows(BadRequestException.class, () -> studentService.createStudent(studentRequest));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void getStudentById_NotFound_ThrowsResourceNotFoundException() {
        when(studentRepository.findById("invalidId")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> studentService.getStudentById("invalidId"));
    }

    @Test
    void deleteStudent_Success() {
        when(studentRepository.findById("stud123")).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        studentService.deleteStudent("stud123");

        assertTrue(student.isDeleted());
        verify(studentRepository, times(1)).save(student);
    }
}
