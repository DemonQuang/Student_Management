# Student Management API Test Suite

Tài liệu này chứa bộ kịch bản kiểm thử API cho hệ thống quản lý học sinh (Student Management System). 
Các kịch bản kiểm thử được viết dưới hai định dạng thông dụng: **HTTP Client (VS Code REST Client)** và **cURL** để bạn dễ dàng chạy và kiểm thử trực tiếp.

---

## Cấu hình Chung (Environment)
* **Base URL**: `http://localhost:8080`
* **Tài khoản mặc định hệ thống**:
  * **ADMIN**: `admin` / `admin123`
  * **USER**: (Có thể tạo mới qua API đăng ký)

---

## Hướng dẫn sử dụng VS Code REST Client
Nếu bạn sử dụng VS Code, bạn có thể cài extension **REST Client** (của Huachao Mao). Tạo một file có đuôi `.http` (ví dụ `api-test.http`), dán nội dung phần dưới vào và click **Send Request** trên mỗi API.

---

# Các Kịch Bản Kiểm Thử

## Phần 1: Xác thực & Đăng ký (Authentication)

### 1.1 Đăng ký tài khoản mới (Role mặc định: USER)
Đăng ký một tài khoản mới để dùng cho việc kiểm thử quyền `USER`.

* **Định dạng HTTP Client:**
```http
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "userpassword123",
  "fullName": "Test Regular User",
  "email": "testuser@gmail.com"
}
```

* **Định dạng cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "userpassword123", "fullName": "Test Regular User", "email": "testuser@gmail.com"}'
```

---

### 1.2 Đăng nhập với quyền ADMIN
Lấy Token của ADMIN để thực hiện các thao tác quản trị (Tạo/Sửa/Xóa Khoa, Lớp, Học sinh, quản lý User).

* **Định dạng HTTP Client:**
```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

* **Định dạng cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

> **Lưu ý:** Copy giá trị `accessToken` từ phản hồi trả về để điền vào phần Bearer Token (`Authorization: Bearer <TOKEN>`) ở các API bên dưới.

---

### 1.3 Đăng nhập với quyền USER vừa tạo
Lấy Token của USER thông thường để kiểm thử tính năng xem/tìm kiếm (không có quyền Thêm/Sửa/Xóa).

* **Định dạng HTTP Client:**
```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "userpassword123"
}
```

* **Định dạng cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "userpassword123"}'
```

---

## Phần 2: Quản lý Khoa (Departments)
*(Yêu cầu Bearer Token của **ADMIN** cho các tác vụ POST/PUT/DELETE. USER chỉ được phép GET)*

### 2.1 Tạo Khoa mới (Yêu cầu ADMIN)
* **Định dạng HTTP Client:**
```http
POST http://localhost:8080/api/v1/departments
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json

{
  "name": "Information Technology"
}
```

* **Định dạng cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/departments \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Information Technology"}'
```

---

### 2.2 Lấy danh sách Khoa (ADMIN hoặc USER)
* **Định dạng HTTP Client:**
```http
GET http://localhost:8080/api/v1/departments
Authorization: Bearer <ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X GET http://localhost:8080/api/v1/departments \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

### 2.3 Cập nhật tên Khoa (Yêu cầu ADMIN)
* **Định dạng HTTP Client:**
```http
PUT http://localhost:8080/api/v1/departments/60c72b2f9b1d8b2bad000003
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json

{
  "name": "Mechanical & Aerospace Engineering"
}
```

* **Định dạng cURL:**
```bash
curl -X PUT http://localhost:8080/api/v1/departments/60c72b2f9b1d8b2bad000003 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mechanical & Aerospace Engineering"}'
```

---

### 2.4 Xóa Khoa (Yêu cầu ADMIN)
*(Thao tác này sẽ lỗi 400 Bad Request nếu Khoa đang chứa các Lớp học)*

* **Định dạng HTTP Client:**
```http
DELETE http://localhost:8080/api/v1/departments/60c72b2f9b1d8b2bad000003
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X DELETE http://localhost:8080/api/v1/departments/60c72b2f9b1d8b2bad000003 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

---

## Phần 3: Quản lý Lớp học (Classrooms)
*(Yêu cầu Bearer Token của **ADMIN** cho các tác vụ POST/PUT/DELETE)*

### 3.1 Tạo Lớp học mới (Yêu cầu ADMIN)
* **Định dạng HTTP Client:**
```http
POST http://localhost:8080/api/v1/classrooms
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json

{
  "name": "Class IT-01",
  "departmentId": "60c72b2f9b1d8b2bad000003"
}
```

* **Định dạng cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/classrooms \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Class IT-01", "departmentId": "60c72b2f9b1d8b2bad000003"}'
```

---

### 3.2 Lấy danh sách Lớp học (ADMIN hoặc USER)
* **Định dạng HTTP Client:**
```http
GET http://localhost:8080/api/v1/classrooms
Authorization: Bearer <ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X GET http://localhost:8080/api/v1/classrooms \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

### 3.3 Cập nhật Lớp học (Yêu cầu ADMIN)
* **Định dạng HTTP Client:**
```http
PUT http://localhost:8080/api/v1/classrooms/60c72b2f9b1d8b2bad000005
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json

{
  "name": "Class IT-01 Edited",
  "departmentId": "60c72b2f9b1d8b2bad000003"
}
```

* **Định dạng cURL:**
```bash
curl -X PUT http://localhost:8080/api/v1/classrooms/60c72b2f9b1d8b2bad000005 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Class IT-01 Edited", "departmentId": "60c72b2f9b1d8b2bad000003"}'
```

---

### 3.4 Xóa Lớp học (Yêu cầu ADMIN)
*(Sẽ thất bại nếu Lớp học đang có học sinh đăng ký học)*

* **Định dạng HTTP Client:**
```http
DELETE http://localhost:8080/api/v1/classrooms/60c72b2f9b1d8b2bad000005
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X DELETE http://localhost:8080/api/v1/classrooms/60c72b2f9b1d8b2bad000005 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

---

## Phần 4: Quản lý Học sinh (Students)
*(Yêu cầu Bearer Token của **ADMIN** cho các tác vụ POST/PUT/DELETE. USER chỉ được truy cập các tác vụ GET)*

### 4.1 Thêm Học sinh mới (Yêu cầu ADMIN)
* **Định dạng HTTP Client:**
```http
POST http://localhost:8080/api/v1/students
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json

{
  "studentCode": "SV001",
  "fullName": "Nguyen Van A",
  "email": "vana@gmail.com",
  "phone": "0912345678",
  "birthday": "2004-01-15",
  "gender": "MALE",
  "address": "Ho Chi Minh City",
  "departmentId": "60c72b2f9b1d8b2bad000003",
  "classroomId": "60c72b2f9b1d8b2bad000005"
}
```

* **Định dạng cURL:**
```bash
curl -X POST http://localhost:8080/api/v1/students \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"studentCode": "SV001", "fullName": "Nguyen Van A", "email": "vana@gmail.com", "phone": "0912345678", "birthday": "2004-01-15", "gender": "MALE", "address": "Ho Chi Minh City", "departmentId": "60c72b2f9b1d8b2bad000003", "classroomId": "60c72b2f9b1d8b2bad000005"}'
```

---

### 4.2 Lấy danh sách học sinh có Phân trang & Sắp xếp (ADMIN hoặc USER)
* **Định dạng HTTP Client:**
```http
GET http://localhost:8080/api/v1/students?page=0&size=10&sort=studentCode&direction=asc
Authorization: Bearer <ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/students?page=0&size=10&sort=studentCode&direction=asc" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

### 4.3 Xem chi tiết 1 Học sinh (ADMIN hoặc USER)
* **Định dạng HTTP Client:**
```http
GET http://localhost:8080/api/v1/students/60c72b2f9b1d8b2bad000007
Authorization: Bearer <ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X GET http://localhost:8080/api/v1/students/60c72b2f9b1d8b2bad000007 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

### 4.4 Tìm kiếm học sinh theo từ khóa (ADMIN hoặc USER)
* **Định dạng HTTP Client:**
```http
GET http://localhost:8080/api/v1/students/search?keyword=vana@gmail.com
Authorization: Bearer <ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/students/search?keyword=vana@gmail.com" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

### 4.5 Lọc học sinh theo tiêu chí (ADMIN hoặc USER)
Lọc theo Giới tính (`MALE`/`FEMALE`/`OTHER`), Trạng thái (`ACTIVE`/`INACTIVE`), Khoa, Lớp.

* **Định dạng HTTP Client:**
```http
GET http://localhost:8080/api/v1/students/filter?gender=MALE&status=ACTIVE
Authorization: Bearer <ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/students/filter?gender=MALE&status=ACTIVE" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

### 4.6 Cập nhật thông tin học sinh (Yêu cầu ADMIN)
* **Định dạng HTTP Client:**
```http
PUT http://localhost:8080/api/v1/students/60c72b2f9b1d8b2bad000007
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json

{
  "fullName": "Nguyen Van A Edited",
  "email": "vana_new@gmail.com",
  "phone": "0912345678",
  "birthday": "2004-01-15",
  "gender": "MALE",
  "address": "Ho Chi Minh City, District 1",
  "status": "ACTIVE",
  "departmentId": "60c72b2f9b1d8b2bad000003",
  "classroomId": "60c72b2f9b1d8b2bad000005"
}
```

* **Định dạng cURL:**
```bash
curl -X PUT http://localhost:8080/api/v1/students/60c72b2f9b1d8b2bad000007 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Nguyen Van A Edited", "email": "vana_new@gmail.com", "phone": "0912345678", "birthday": "2004-01-15", "gender": "MALE", "address": "Ho Chi Minh City, District 1", "status": "ACTIVE", "departmentId": "60c72b2f9b1d8b2bad000003", "classroomId": "60c72b2f9b1d8b2bad000005"}'
```

---

### 4.7 Xóa mềm Học sinh (Yêu cầu ADMIN)
*(Dữ liệu học sinh sẽ được đánh dấu đã xóa nhưng không bị xóa vĩnh viễn khỏi Database)*

* **Định dạng HTTP Client:**
```http
DELETE http://localhost:8080/api/v1/students/60c72b2f9b1d8b2bad000007
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X DELETE http://localhost:8080/api/v1/students/60c72b2f9b1d8b2bad000007 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

---

## Phần 5: Quản lý Người dùng (User Accounts - Chỉ ADMIN)
*(Yêu cầu Bearer Token của **ADMIN**)*

### 5.1 Lấy danh sách Người dùng
* **Định dạng HTTP Client:**
```http
GET http://localhost:8080/api/v1/users
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

---

### 5.2 Cập nhật Role cho User (Ví dụ: Thăng quyền lên ADMIN)
* **Định dạng HTTP Client:**
```http
PUT http://localhost:8080/api/v1/users/60c72b2f9b1d8b2bad000002/role
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
Content-Type: application/json

{
  "role": "ADMIN"
}
```

* **Định dạng cURL:**
```bash
curl -X PUT http://localhost:8080/api/v1/users/60c72b2f9b1d8b2bad000002/role \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

---

### 5.3 Xóa tài khoản User
* **Định dạng HTTP Client:**
```http
DELETE http://localhost:8080/api/v1/users/60c72b2f9b1d8b2bad000002
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

* **Định dạng cURL:**
```bash
curl -X DELETE http://localhost:8080/api/v1/users/60c72b2f9b1d8b2bad000002 \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```
