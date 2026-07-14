package com.studentmanagement.studentapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private String id;
    private String studentCode;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate birthday;
    private String gender;
    private String address;
    private String status;
    private String departmentId;
    private List<String> classroomIds;
    private String avatar;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
