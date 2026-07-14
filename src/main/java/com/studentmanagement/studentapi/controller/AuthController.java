package com.studentmanagement.studentapi.controller;

import com.studentmanagement.studentapi.dto.request.LoginRequest;
import com.studentmanagement.studentapi.dto.request.RegisterRequest;
import com.studentmanagement.studentapi.dto.response.ApiResponse;
import com.studentmanagement.studentapi.dto.response.LoginResponse;
import com.studentmanagement.studentapi.dto.response.UserResponse;
import com.studentmanagement.studentapi.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse userResponse = authService.registerUser(registerRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", userResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.login(loginRequest);
        return ResponseEntity
                .ok(ApiResponse.success("Logged in successfully", loginResponse));
    }
}
