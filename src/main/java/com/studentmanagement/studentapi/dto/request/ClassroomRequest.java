package com.studentmanagement.studentapi.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClassroomRequest {
    @NotBlank(message = "Classroom name is required")
    private String name;

    @NotBlank(message = "Department ID is required")
    private String departmentId;

    private Boolean active;
}
