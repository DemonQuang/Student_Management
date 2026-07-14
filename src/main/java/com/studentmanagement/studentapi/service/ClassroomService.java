package com.studentmanagement.studentapi.service;

import com.studentmanagement.studentapi.dto.request.ClassroomRequest;
import com.studentmanagement.studentapi.dto.response.ClassroomResponse;

import java.util.List;

public interface ClassroomService {
    ClassroomResponse createClassroom(ClassroomRequest request);
    ClassroomResponse updateClassroom(String id, ClassroomRequest request);
    List<ClassroomResponse> getAllClassrooms();
    ClassroomResponse getClassroomById(String id);
    void deleteClassroom(String id);
    List<ClassroomResponse> getClassroomsByDepartmentId(String departmentId);
}
