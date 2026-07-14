package com.studentmanagement.studentapi.service.impl;

import com.studentmanagement.studentapi.dto.request.UpdateRoleRequest;
import com.studentmanagement.studentapi.dto.response.UserResponse;
import com.studentmanagement.studentapi.entity.User;
import com.studentmanagement.studentapi.exception.ResourceNotFoundException;
import com.studentmanagement.studentapi.repository.UserRepository;
import com.studentmanagement.studentapi.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateUserRole(String id, UpdateRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        user.setRole(request.getRole());
        User updatedUser = userRepository.save(user);
        log.info("Updated role of User ID: {} to: {}", id, request.getRole());

        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        userRepository.delete(user);
        log.info("Deleted User ID: {}", id);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .build();
    }
}
