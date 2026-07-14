# Student Management System API

> A production-style RESTful API built with Spring Boot for managing students with authentication, authorization, audit logging, Docker deployment, testing, and clean architecture.

---

# 1. Project Overview

Student Management System là hệ thống quản lý sinh viên dành cho trường học.

Hệ thống được xây dựng theo kiến trúc RESTful API và áp dụng các best practices của Spring Boot.

Project được thiết kế để thể hiện đầy đủ các kỹ năng Backend Java của một Fresher Developer.

---

# 2. Main Features

## Authentication

* Register User
* Login
* JWT Authentication
* Refresh Token (Optional)
* Logout (Optional)

---

## Authorization

Hai vai trò:

### ADMIN

Có toàn quyền.

* CRUD Student
* CRUD Department
* CRUD Classroom
* Xóa dữ liệu
* Xem Dashboard
* Quản lý User

---

### USER

Chỉ được

* Xem Student
* Search Student
* Filter Student
* Xem Department
* Xem Classroom

Không được

* Create
* Update
* Delete

---

# 3. Technology Stack

* Java 21
* Spring Boot 3
* Spring Security
* JWT
* Spring Data MongoDB
* MongoTemplate
* MongoDB
* Lombok
* Validation
* Swagger OpenAPI
* SLF4J Logging
* JUnit 5
* Mockito
* Docker
* Docker Compose
* Maven

---

# 4. Project Structure

student-management-api

```
src
│
├── config
│
├── controller
│
├── dto
│
│── request
│── response
│
├── entity
│
├── repository
│
├── service
│     ├── impl
│
├── security
│     ├── jwt
│     ├── filter
│     ├── config
│
├── audit
│
├── exception
│
├── mapper
│
├── util
│
├── logging
│
├── test
│
└── StudentManagementApplication
```

---

# 5. Database Design (MongoDB)

Hệ thống sử dụng MongoDB làm cơ sở dữ liệu tài liệu (Document Database).

## `users` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính tài liệu |
| `username` | String | Tên đăng nhập (Unique, Required) |
| `password` | String | Mật khẩu băm BCrypt |
| `fullName` | String | Tên đầy đủ |
| `email` | String | Email (Unique, Required) |
| `role` | String | Vai trò: `ADMIN` hoặc `USER` |
| `enabled` | Boolean | Trạng thái tài khoản |

---

## `departments` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính tài liệu |
| `name` | String | Tên khoa (Unique, Required) |
| `createdAt` | Date | Thời gian tạo |
| `updatedAt` | Date | Thời gian cập nhật |
| `createdBy` | String | Người tạo |
| `updatedBy` | String | Người cập nhật |

---

## `classrooms` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính tài liệu |
| `name` | String | Tên lớp (Required) |
| `departmentId` | ObjectId | Tham chiếu khoa (`departments._id`) |
| `createdAt` | Date | Thời gian tạo |
| `updatedAt` | Date | Thời gian cập nhật |
| `createdBy` | String | Người tạo |
| `updatedBy` | String | Người cập nhật |

---

## `students` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính tài liệu |
| `studentCode` | String | Mã sinh viên (Unique, Required) |
| `fullName` | String | Tên sinh viên (Required) |
| `email` | String | Email sinh viên (Unique, Required) |
| `phone` | String | Số điện thoại (Unique, Required) |
| `birthday` | Date | Ngày sinh (Required) |
| `gender` | String | Giới tính: `MALE`, `FEMALE`, `OTHER` |
| `address` | String | Địa chỉ |
| `status` | String | Trạng thái: `ACTIVE`, `INACTIVE`, `GRADUATED`, `SUSPENDED` |
| `departmentId` | ObjectId | Tham chiếu khoa (`departments._id`) |
| `classroomId` | ObjectId | Tham chiếu lớp học (`classrooms._id`) |
| `deleted` | Boolean | Trạng thái xóa mềm (Default: `false`) |
| `createdAt` | Date | Thời gian tạo |
| `updatedAt` | Date | Thời gian cập nhật |
| `createdBy` | String | Người tạo |
| `updatedBy` | String | Người cập nhật |

---

# 6. Audit Fields

Tất cả bảng đều có

```
createdAt

updatedAt

createdBy

updatedBy
```

Ví dụ

```
createdBy = admin

updatedBy = huyhoang
```

Spring Security sẽ lấy username từ JWT để lưu tự động.

---

# 7. Student APIs

## ADMIN

POST

/api/v1/students

Tạo Student

---

PUT

/api/v1/students/{id}

Cập nhật Student

---

DELETE

/api/v1/students/{id}

Soft Delete Student

---

GET

/api/v1/students

Danh sách Student

Có

* Pagination

* Sorting

* Search

* Filter

---

GET

/api/v1/students/{id}

Chi tiết Student

---

GET

/api/v1/students/search

Search theo

* Name

* Student Code

* Email

---

GET

/api/v1/students/filter

Filter

* Department

* Classroom

* Gender

* Status

---

# 8. Department APIs

CRUD

---

# 9. Classroom APIs

CRUD

---

# 10. User APIs

POST

/api/v1/auth/register

---

POST

/api/v1/auth/login

---

GET

/api/v1/users

(Admin)

---

PUT

/api/v1/users/{id}/role

(Admin)

---

DELETE

/api/v1/users/{id}

(Admin)

---

# 11. JWT Workflow

Login

↓

Kiểm tra Username Password

↓

Generate JWT

↓

Client lưu Token

↓

Request tiếp theo

Authorization

Bearer Token

↓

JWT Filter

↓

Spring Security

↓

Controller

↓

Response

---

# 12. Authorization Matrix

| API             | USER | ADMIN |
| --------------- | ---- | ----- |
| Login           | ✔    | ✔     |
| Register        | ✔    | ✔     |
| View Student    | ✔    | ✔     |
| Search Student  | ✔    | ✔     |
| Create Student  | ❌    | ✔     |
| Update Student  | ❌    | ✔     |
| Delete Student  | ❌    | ✔     |
| CRUD Department | ❌    | ✔     |
| CRUD Classroom  | ❌    | ✔     |
| Manage User     | ❌    | ✔     |

---

# 13. Validation

Student Code

* Required

* Unique

Email

* Required

* Email Format

* Unique

Phone

* Required

* 10 digits

Birthday

* Must be before today

Department

* Must exist

Classroom

* Must exist

---

# 14. Global Exception

400

Validation Error

---

401

Unauthorized

---

403

Forbidden

---

404

Not Found

---

409

Duplicate Data

---

500

Internal Server Error

---

# 15. Logging (SLF4J)

Log tất cả request quan trọng.

Ví dụ

INFO

```
Admin created student SV001
```

INFO

```
User login successfully
```

WARN

```
Invalid JWT Token
```

ERROR

```
Student not found
```

Log được lưu

```
logs/application.log
```

---

# 16. Unit Testing

Framework

* JUnit 5

* Mockito

Test

StudentService

```
Create Student

Update Student

Delete Student

Find Student

Search Student
```

AuthenticationService

```
Login Success

Login Fail

Register
```

Repository Mock

Service Test

Coverage mục tiêu

> 80%

---

# 17. Docker

Dockerfile

```
FROM eclipse-temurin:21-jdk

COPY target/student-api.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]
```

---

Docker Compose

Gồm

* Spring Boot

* MongoDB

* Mongo Express

```
version: "3"

services:

  mongodb:

  mongo-express:

  student-api:
```

---

# 18. Swagger

```
http://localhost:8080/swagger-ui/index.html
```

---

# 19. README

README gồm

## Introduction

## Features

## Technologies

## Installation

Clone project

```
git clone ...
```

Build

```
mvn clean install
```

Run

```
mvn spring-boot:run
```

Hoặc

```
docker compose up
```

---

Environment

```
MONGODB_URI

MONGODB_DATABASE

JWT_SECRET

JWT_EXPIRE
```

---

Import Database

```
mongoimport --uri="mongodb://localhost:27017/student_management" --collection=<collection_name> --file=seeding/<file_name>.json --jsonArray --mode=upsert
```

---

Swagger

```
http://localhost:8080/swagger-ui/index.html
```

---

Default Account

ADMIN

```
username: admin

password: admin123
```

USER

```
username: user

password: user123
```

---

# 20. Business Rules

Student Code phải duy nhất.

Email phải duy nhất.

Phone phải duy nhất.

Department phải tồn tại.

Classroom phải tồn tại.

Không được xóa Department nếu còn Classroom.

Không được xóa Classroom nếu còn Student.

Delete Student là Soft Delete.

USER không được CRUD.

ADMIN có toàn quyền.

JWT hết hạn phải login lại.

Audit tự động lưu createdBy và updatedBy.

---

# 21. Future Improvements

* Refresh Token
* Email Verification
* Forgot Password
* Upload Avatar
* Export Excel
* Import Excel
* Redis Cache
* API Rate Limiting
* CI/CD (GitHub Actions)
* SonarQube
* Integration Test
* TestContainers
* Kubernetes Deployment
* Monitoring (Prometheus + Grafana)

---

# 22. Project Highlights

✔ Clean Architecture

✔ RESTful API

✔ Spring Security

✔ JWT Authentication

✔ Role-Based Authorization

✔ Audit

✔ Validation

✔ Global Exception

✔ Pagination

✔ Search

✔ Filter

✔ Sorting

✔ Soft Delete

✔ Logging (SLF4J)

✔ Unit Test (JUnit + Mockito)

✔ Swagger Documentation

✔ Docker

✔ Docker Compose

✔ MySQL

✔ Maven

✔ Production-ready Folder Structure
