package com.studentmanagement.studentapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "students")
public class Student extends AuditingEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    private String studentCode;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String phone;

    private LocalDate birthday;

    private String gender; // MALE, FEMALE, OTHER

    private String address;

    private String status; // ACTIVE, INACTIVE, GRADUATED, SUSPENDED

    @Indexed
    private String departmentId;

    private List<String> classroomIds;

    private String classroomId; // legacy field for backward compatibility

    private String avatar; // base64 encoded image

    @Builder.Default
    private boolean deleted = false;
}
