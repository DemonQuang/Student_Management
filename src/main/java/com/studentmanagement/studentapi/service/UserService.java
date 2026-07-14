package com.studentmanagement.studentapi.service;

import com.studentmanagement.studentapi.dto.request.UpdateRoleRequest;
import com.studentmanagement.studentapi.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse updateUserRole(String id, UpdateRoleRequest request);
    void deleteUser(String id);
}
