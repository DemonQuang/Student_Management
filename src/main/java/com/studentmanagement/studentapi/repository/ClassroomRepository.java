package com.studentmanagement.studentapi.repository;

import com.studentmanagement.studentapi.entity.Classroom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassroomRepository extends MongoRepository<Classroom, String> {
    List<Classroom> findByDepartmentId(String departmentId);
    Boolean existsByDepartmentId(String departmentId);
}
