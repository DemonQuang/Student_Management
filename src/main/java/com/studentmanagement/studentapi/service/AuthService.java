package com.studentmanagement.studentapi.service;

import com.studentmanagement.studentapi.dto.request.LoginRequest;
import com.studentmanagement.studentapi.dto.request.RegisterRequest;
import com.studentmanagement.studentapi.dto.response.LoginResponse;
import com.studentmanagement.studentapi.dto.response.UserResponse;

public interface AuthService {
    UserResponse registerUser(RegisterRequest registerRequest);
    LoginResponse login(LoginRequest loginRequest);
}
