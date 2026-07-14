# Hướng dẫn Chạy Backend & Kiểm thử với Postman

Tài liệu này hướng dẫn chi tiết cách khởi chạy dự án Spring Boot Backend API và cách sử dụng Postman để kiểm thử các chức năng của hệ thống.

---

## 1. Chuẩn bị Môi trường

Để chạy được dự án, máy tính của bạn cần được cài đặt sẵn:
1. **Java Development Kit (JDK) 21**
2. **Apache Maven 3.x**
3. **MongoDB** (Hoặc chạy qua Docker)
4. **Postman** (Để gửi các HTTP request kiểm thử)

---

## 2. Cách Khởi chạy Backend (Spring Boot API)

Bạn có hai cách để khởi chạy Backend:

### Cách 1: Chạy trực tiếp qua Maven (Khuyên dùng khi Dev)
1. **Khởi động cơ sở dữ liệu MongoDB**: Đảm bảo MongoDB của bạn đang hoạt động tại địa chỉ mặc định `mongodb://localhost:27017`.
2. **Khởi chạy ứng dụng**: Mở terminal tại thư mục gốc dự án (`c:\DoAnCacMon\StudentManagement`) và chạy lệnh:
   ```bash
   mvn spring-boot:run
   ```
3. **Xác nhận**: Ứng dụng sẽ khởi động trên cổng mặc định `8080`. Bạn có thể truy cập giao diện Swagger UI để kiểm tra:
   * Địa chỉ Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

### Cách 2: Chạy thông qua Docker Compose (Chạy đóng gói độc lập)
Nếu máy bạn có cài đặt **Docker** và **Docker Compose**, bạn không cần cài JDK, Maven hay MongoDB cục bộ. Hệ thống sẽ tự tạo các container kết nối với nhau:
1. Mở terminal tại thư mục gốc dự án.
2. Khởi chạy toàn bộ dịch vụ:
   ```bash
   docker compose up --build -d
   ```
3. **Mạng lưới dịch vụ được khởi tạo**:
   * **Backend API**: Chạy tại [http://localhost:8080](http://localhost:8080)
   * **MongoDB**: Chạy tại cổng `27017`
   * **Mongo Express** (Giao diện xem DB): Chạy tại [http://localhost:8081](http://localhost:8081)
4. Tắt dịch vụ khi không dùng:
   ```bash
   docker compose down
   ```

---

## 3. Hướng dẫn Kiểm thử bằng Postman

Chúng tôi đã chuẩn bị sẵn tệp Postman Collection đầy đủ các kịch bản test tại thư mục gốc dự án: [postman_collection.json](file:///c:/DoAnCacMon/StudentManagement/postman_collection.json).

### Bước 1: Import Collection vào Postman
1. Mở ứng dụng **Postman**.
2. Nhấn nút **Import** ở góc trên bên trái.
3. Chọn tệp `postman_collection.json` nằm tại thư mục dự án `c:\DoAnCacMon\StudentManagement\postman_collection.json` và kéo thả vào Postman để import.
4. Bạn sẽ thấy một thư mục Collection tên là **"Student Management System API"** hiển thị ở danh sách bên trái.

---

### Bước 2: Thiết lập Biến Môi trường (Environment Variables) trong Postman
Để các request chạy tự động, bạn cần cấu hình các biến môi trường cho Collection này:
1. Click vào Collection **"Student Management System API"** -> Chọn tab **Variables**.
2. Thiết lập các biến sau:
   * `base_url`: Giá trị mặc định là `http://localhost:8080` (địa chỉ của Backend API).
   * `token`: Để trống (biến này sẽ tự động lưu JWT token khi bạn đăng nhập thành công).
   * `dept_id`: Nhập ID khoa (sau khi bạn tạo Department thành công, hãy copy ID của nó từ kết quả trả về dán vào đây).
   * `classroom_id`: Nhập ID lớp học (sau khi tạo Classroom thành công).
   * `student_id`: Nhập ID sinh viên (sau khi tạo Student thành công).
   * `user_id`: Nhập ID User cần đổi quyền/xóa.
3. Nhấp nút **Save** ở góc trên bên phải.

---

### Bước 3: Quy trình Kiểm thử các API

#### 1. Đăng ký & Đăng nhập (Authentication)
* Mở thư mục `1. Authentication`:
  * Chạy request **"Register User / Admin"** để tạo tài khoản Admin (hoặc User).
  * Chạy request **"Login (Generate JWT)"** với thông tin tài khoản vừa đăng ký.
  * **Đặc tính tự động**: Sau khi gọi Login thành công, mã Script tự động trích xuất `accessToken` trong kết quả trả về và gán vào biến môi trường `token` cho bạn.

#### 2. Thử nghiệm Phân quyền (Authorization Matrix)
* **Quyền USER**: 
  * Hãy tạo một tài khoản mới vai trò mặc định là `USER` (qua Register) và dùng tài khoản này để Đăng nhập lấy token.
  * Thử gọi các API trong thư mục `2. Department Management` -> **"Create Department"** hoặc **"Delete Department"**. Hệ thống sẽ lập tức trả về lỗi `403 Forbidden` (do USER không được phép CRUD).
  * Thử gọi các API xem danh sách sinh viên -> Hệ thống cho phép thành công.
* **Quyền ADMIN**:
  * Chạy API **"Update User Role"** (chỉ thực hiện được bằng tài khoản ADMIN cũ, mặc định là tài khoản có sẵn trong DB seed data) để nâng quyền tài khoản mới lên `ADMIN`.
  * Sau khi tài khoản mới có quyền `ADMIN`, bạn đăng nhập lại để nhận token mới. Lúc này, bạn có thể thực hiện mọi thao tác CRUD tự do.

#### 3. Kiểm thử Ràng buộc Toàn vẹn Dữ liệu
* **Ràng buộc Khoa - Lớp**:
  * Thử chạy **"Delete Department"** khi khoa đó đang có lớp học liên kết. Hệ thống sẽ trả về lỗi `400 Bad Request` chặn thao tác.
* **Ràng buộc Lớp - Sinh viên**:
  * Thử chạy **"Delete Classroom"** khi lớp học đang chứa sinh viên (ngay cả sinh viên đã bị xóa mềm `deleted = true`). Hệ thống sẽ trả về lỗi `400 Bad Request` chặn xóa.
  * Thử chạy **"Update Classroom"** để thay đổi `departmentId` của lớp khi lớp đã có sinh viên đăng ký. Hệ thống sẽ chặn hành vi này bằng lỗi `400`.
* **Ràng buộc Chéo Sinh viên**:
  * Thử chạy **"Create Student"** nhưng truyền vào một `classroomId` thuộc khoa A và `departmentId` là khoa B. Hệ thống sẽ chặn ngay lập tức bằng lỗi `400 Bad Request` ("Classroom does not belong to the selected Department").
