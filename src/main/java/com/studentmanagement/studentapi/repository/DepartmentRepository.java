package com.studentmanagement.studentapi.repository;

import com.studentmanagement.studentapi.entity.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends MongoRepository<Department, String> {
    Optional<Department> findByName(String name);
    Boolean existsByName(String name);
}
