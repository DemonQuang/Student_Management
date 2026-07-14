# EduManager - Student Management System

> Hệ thống quản lý sinh viên toàn diện với **Spring Boot 3** (Backend) + **React / Vite** (Frontend), sử dụng MongoDB làm cơ sở dữ liệu.

---

## 1. Tổng quan

Hệ thống cho phép:

- **Quản lý sinh viên**: Thêm, sửa, xóa mềm, xem chi tiết, tìm kiếm & lọc đa điều kiện
- **Quản lý khoa đào tạo**: CRUD khoa, xem số lượng sinh viên theo khoa
- **Quản lý lớp học**: CRUD lớp, ràng buộc xóa khi còn sinh viên, đếm sĩ số
- **Xác thực & phân quyền**: JWT, hai vai trò ADMIN / USER (sinh viên)
- **Dashboard**: Thống kê tổng quan cho Admin và Student
- **Auditing**: Lưu vết tự động (createdAt, updatedAt, createdBy, updatedBy)

---

## 2. Công nghệ sử dụng

### Backend
| Công nghệ | Mục đích |
|---|---|
| Java 21 | Ngôn ngữ lập trình |
| Spring Boot 3.3 | Framework chính |
| Spring Data MongoDB | Tương tác NoSQL |
| Spring Security + JWT | Xác thực & phân quyền |
| Lombok | Giảm boilerplate code |
| Jakarta Validation | Validate dữ liệu đầu vào |
| Swagger OpenAPI 3 | Tài liệu hóa API |
| SLF4J / Logback | Ghi log |
| JUnit 5 + Mockito | Unit Test |
| Docker / Docker Compose | Container hóa |

### Frontend
| Công nghệ | Mục đích |
|---|---|
| React 18 | UI Library |
| Vite 8 | Build tool |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Điều hướng |
| Axios | HTTP Client |
| Material Symbols | Icon set |

---

## 3. Cấu trúc dự án

```
StudentManagement/
│
├── src/main/java/com/studentmanagement/studentapi/    # Backend
│   ├── controller/        # REST Controllers
│   ├── dto/               # Request / Response DTOs
│   ├── entity/            # MongoDB Document Models
│   ├── repository/        # Spring Data Repositories
│   ├── service/           # Business Logic
│   │   └── impl/
│   ├── security/          # JWT, Filter, Security Config
│   │   ├── config/
│   │   ├── filter/
│   │   └── jwt/
│   └── exception/         # Global Exception Handler
│
├── frontend/              # Frontend (React + Vite)
│   └── src/
│       ├── components/    # Layout components
│       ├── pages/         # Page components
│       │   ├── admin/     # Admin pages
│       │   └── student/   # Student pages
│       ├── services/      # API service layer
│       └── context/       # Auth context
│
├── docs/                  # Documentation
├── docker-compose.yml
├── pom.xml
└── README.md
```

---

## 4. Database Design (MongoDB Collections)

### `users`
| Field | Type | Ghi chú |
|---|---|---|
| `_id` | String | Primary Key |
| `username` | String | Tên đăng nhập (unique, indexed) |
| `password` | String | BCrypt hash |
| `fullName` | String | Họ tên |
| `email` | String | Email (unique, indexed) |
| `role` | String | `ADMIN` hoặc `USER` |
| `enabled` | Boolean | Kích hoạt tài khoản |

### `departments`
| Field | Type | Ghi chú |
|---|---|---|
| `_id` | String | Primary Key |
| `name` | String | Tên khoa |
| `createdAt` | Instant | Auditing |
| `updatedAt` | Instant | Auditing |
| `createdBy` | String | Auditing |
| `updatedBy` | String | Auditing |

### `classrooms`
| Field | Type | Ghi chú |
|---|---|---|
| `_id` | String | Primary Key |
| `name` | String | Tên lớp học |
| `departmentId` | String | FK → departments |
| `active` | Boolean | Trạng thái hoạt động |
| `createdAt` | Instant | Auditing |
| `updatedAt` | Instant | Auditing |
| `createdBy` | String | Auditing |
| `updatedBy` | String | Auditing |

### `students`
| Field | Type | Ghi chú |
|---|---|---|
| `_id` | String | Primary Key |
| `studentCode` | String | MSSV (unique, indexed) |
| `fullName` | String | Họ tên |
| `email` | String | Email (unique, indexed) |
| `phone` | String | SĐT (unique, indexed) |
| `birthday` | LocalDate | Ngày sinh |
| `gender` | String | `MALE`, `FEMALE`, `OTHER` |
| `address` | String | Địa chỉ |
| `status` | String | `ACTIVE`, `INACTIVE`, `GRADUATED`, `SUSPENDED` |
| `departmentId` | String | FK → departments |
| `classroomIds` | `List<String>` | Danh sách lớp học (mới) |
| `classroomId` | String | Legacy field (tương thích ngược) |
| `avatar` | String | Ảnh đại diện (base64) |
| `deleted` | Boolean | Soft delete flag |
| `createdAt` | Instant | Auditing |
| `updatedAt` | Instant | Auditing |
| `createdBy` | String | Auditing |
| `updatedBy` | String | Auditing |

---

## 5. Entity Relationships

```
[departments] 1 ─── N  [classrooms]    (qua departmentId)
[departments] 1 ─── N  [students]      (qua departmentId)
[classrooms]  N ─── M  [students]      (qua classroomIds)
[users]        1 ─── 1  [students]     (qua email)
```

- Ràng buộc toàn vẹn được kiểm tra ở layer Service
- Student có thể thuộc nhiều lớp học (`classroomIds` là mảng)
- Mỗi student phải có email trùng với một `users` đã đăng ký

---

## 6. API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Vai trò |
|---|---|---|
| POST | `/register` | Public - Đăng ký |
| POST | `/login` | Public - Đăng nhập |

### Students (`/api/v1/students`)
| Method | Endpoint | Vai trò |
|---|---|---|
| GET | `/` | ADMIN, USER - Danh sách phân trang |
| GET | `/search` | ADMIN, USER - Tìm kiếm từ khóa |
| GET | `/filter` | ADMIN, USER - Lọc đa điều kiện |
| GET | `/{id}` | ADMIN, USER - Chi tiết |
| POST | `/` | ADMIN - Tạo mới |
| PUT | `/{id}` | ADMIN - Cập nhật |
| DELETE | `/{id}` | ADMIN - Xóa mềm |

### Departments (`/api/v1/departments`)
| Method | Endpoint | Vai trò |
|---|---|---|
| GET | `/` | ADMIN, USER - Danh sách |
| GET | `/{id}` | ADMIN, USER - Chi tiết |
| POST | `/` | ADMIN - Tạo mới |
| PUT | `/{id}` | ADMIN - Cập nhật |
| DELETE | `/{id}` | ADMIN - Xóa (chặn nếu còn SV) |

### Classrooms (`/api/v1/classrooms`)
| Method | Endpoint | Vai trò |
|---|---|---|
| GET | `/` | ADMIN, USER - Danh sách |
| GET | `/{id}` | ADMIN, USER - Chi tiết |
| GET | `/department/{departmentId}` | ADMIN, USER - Theo khoa |
| POST | `/` | ADMIN - Tạo mới |
| PUT | `/{id}` | ADMIN - Cập nhật |
| DELETE | `/{id}` | ADMIN - Xóa (chặn nếu còn SV) |

### Users (`/api/v1/users`)
| Method | Endpoint | Vai trò |
|---|---|---|
| GET | `/` | ADMIN - Danh sách user |
| PUT | `/{id}/role` | ADMIN - Đổi vai trò |
| DELETE | `/{id}` | ADMIN - Xóa user |

### Dashboard (`/api/v1/dashboard`)
| Method | Endpoint | Vai trò |
|---|---|---|
| GET | `/` | ADMIN, USER - Thống kê |

---

## 7. Cài đặt & Chạy

### Yêu cầu
- **Java 21+**
- **Node.js 18+**
- **MongoDB 6+** (local hoặc Docker)
- **Maven 3.9+**

### 1. Clone project
```bash
git clone <repository_url>
cd StudentManagement
```

### 2. Backend
```bash
# Build
mvn clean install

# Chạy (mặc định port 8080)
mvn spring-boot:run
```

### 3. Frontend
```bash
cd frontend

# Cài dependencies
npm install

# Chạy dev (mặc định port 5173)
npm run dev
```

### 4. Docker (tùy chọn)
```bash
docker compose up -d
```

### Biến môi trường
| Biến | Mặc định | Ghi chú |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017` | URI kết nối MongoDB |
| `MONGODB_DATABASE` | `student_management` | Tên database |
| `JWT_SECRET` | `404E6352...` | Secret key 256-bit |
| `JWT_EXPIRE` | `86400000` | Token hết hạn (ms) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:*,http://127.0.0.1:*` | Origin được phép CORS |

---

## 8. Tài khoản mặc định (Seeding)

| Vai trò | Username | Password | Email |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | `admin@school.edu.vn` |
| **Sinh viên** | `user` | `user123` | `sv01@student.edu.vn` |

> Dữ liệu seed được tạo tự động khi chạy lần đầu qua `DataSeeder.java`.

---

## 9. Tài liệu tham khảo

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs**: `docs/` (chi tiết endpoint, request/response mẫu)
- **Database Design**: `docs/database/`
- **Domain Specs**: `docs/domains/`
