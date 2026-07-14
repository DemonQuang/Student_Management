package com.studentmanagement.studentapi.controller;

import com.studentmanagement.studentapi.dto.response.ApiResponse;
import com.studentmanagement.studentapi.dto.response.DashboardResponse;
import com.studentmanagement.studentapi.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse response = dashboardService.getDashboardData();
        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved successfully", response));
    }
}
