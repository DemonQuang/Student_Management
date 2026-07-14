package com.studentmanagement.studentapi.repository;

import com.studentmanagement.studentapi.entity.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    
    Optional<Student> findByStudentCode(String studentCode);

    Boolean existsByStudentCode(String studentCode);

    Boolean existsByEmail(String email);

    Boolean existsByPhone(String phone);

    Boolean existsByClassroomId(String classroomId);

    Boolean existsByClassroomIdsContaining(String classroomId);

    long countByClassroomIdAndDeletedFalse(String classroomId);

    long countByClassroomIdsContainingAndDeletedFalse(String classroomId);
}
