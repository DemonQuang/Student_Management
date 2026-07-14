package com.studentmanagement.studentapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalStudents;
    private long totalDepartments;
    private long totalClassrooms;
    private long totalUsers;
    private List<DepartmentDistribution> departmentDistribution;
    private List<StatusDistribution> statusDistribution;
    private List<GenderDistribution> genderDistribution;
    private List<RecentStudent> recentStudents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentDistribution {
        private String departmentName;
        private String departmentId;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusDistribution {
        private String status;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenderDistribution {
        private String gender;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentStudent {
        private String id;
        private String studentCode;
        private String fullName;
        private String departmentName;
        private String status;
        private Instant createdAt;
    }
}
