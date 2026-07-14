# Student API

These endpoints manage student records, providing operations for creation, updates, soft deletion, and advanced querying (pagination, sorting, filtering, and searching).

---

## 1. Retrieve Paginated Students

Fetch a page of students. Soft-deleted students are omitted from this list.

- **URL**: `/api/v1/students`
- **Method**: `GET`
- **Authentication Required**: Yes (`USER` or `ADMIN` role)
- **Query Parameters**:
  - `page` (integer, default `0`): Page index.
  - `size` (integer, default `10`): Items count per page.
  - `sort` (string, default `id`): Sort field.
  - `direction` (string, default `asc`): Sort direction (`asc` or `desc`).

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "content": [
      {
        "id": "60c72b2f9b1d8b2bad000007",
        "studentCode": "SV001",
        "fullName": "Nguyen Van A",
        "email": "vana@gmail.com",
        "phone": "0912345678",
        "birthday": "2004-01-15",
        "gender": "MALE",
        "address": "Ho Chi Minh City",
        "status": "ACTIVE",
        "departmentId": "60c72b2f9b1d8b2bad000003",
        "classroomId": "60c72b2f9b1d8b2bad000005"
      }
    ],
    "pageNo": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  }
}
```

---

## 2. Retrieve Student Details

Fetch details of a single student by their ID.

- **URL**: `/api/v1/students/{id}`
- **Method**: `GET`
- **Authentication Required**: Yes (`USER` or `ADMIN` role)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Student details retrieved successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000007",
    "studentCode": "SV001",
    "fullName": "Nguyen Van A",
    "email": "vana@gmail.com",
    "phone": "0912345678",
    "birthday": "2004-01-15",
    "gender": "MALE",
    "address": "Ho Chi Minh City",
    "status": "ACTIVE",
    "departmentId": "60c72b2f9b1d8b2bad000003",
    "classroomId": "60c72b2f9b1d8b2bad000005"
  }
}
```

### Error Response (HTTP 404 Not Found)
```json
{
  "success": false,
  "message": "Student not found with ID: 60c72b2f9b1d8b2bad999999"
}
```

---

## 3. Search Students

Find students matching a keyword query against name, code, or email.

- **URL**: `/api/v1/students/search`
- **Method**: `GET`
- **Authentication Required**: Yes (`USER` or `ADMIN` role)
- **Query Parameter**: `keyword` (string, required)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "60c72b2f9b1d8b2bad000007",
      "studentCode": "SV001",
      "fullName": "Nguyen Van A",
      "email": "vana@gmail.com"
    }
  ]
}
```

---

## 4. Filter Students

Filter student records by department, classroom, gender, or status.

- **URL**: `/api/v1/students/filter`
- **Method**: `GET`
- **Authentication Required**: Yes (`USER` or `ADMIN` role)
- **Query Parameters**:
  - `departmentId` (string/ObjectId, optional)
  - `classroomId` (string/ObjectId, optional)
  - `gender` (string, optional: `MALE`, `FEMALE`, `OTHER`)
  - `status` (string, optional: `ACTIVE`, `INACTIVE`, `GRADUATED`, `SUSPENDED`)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Filter completed successfully",
  "data": [
    {
      "id": "60c72b2f9b1d8b2bad000007",
      "studentCode": "SV001",
      "fullName": "Nguyen Van A",
      "status": "ACTIVE",
      "gender": "MALE",
      "departmentId": "60c72b2f9b1d8b2bad000003",
      "classroomId": "60c72b2f9b1d8b2bad000005"
    }
  ]
}
```

---

## 5. Create Student

Register a new student record in the database.

- **URL**: `/api/v1/students`
- **Method**: `POST`
- **Authentication Required**: Yes (`ADMIN` role only)

### Request Payload (JSON)
```json
{
  "studentCode": "SV004",
  "fullName": "Le Thi D",
  "email": "thid@gmail.com",
  "phone": "0934567890",
  "birthday": "2004-09-12",
  "gender": "FEMALE",
  "address": "Danang",
  "departmentId": "60c72b2f9b1d8b2bad000003",
  "classroomId": "60c72b2f9b1d8b2bad000005"
}
```

### Success Response (HTTP 201 Created)
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000009",
    "studentCode": "SV004",
    "fullName": "Le Thi D",
    "email": "thid@gmail.com",
    "phone": "0934567890",
    "birthday": "2004-09-12",
    "gender": "FEMALE",
    "address": "Danang",
    "status": "ACTIVE",
    "departmentId": "60c72b2f9b1d8b2bad000003",
    "classroomId": "60c72b2f9b1d8b2bad000005"
  }
}
```

### Error Responses

#### HTTP 400 Bad Request (Validation constraints failed)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "phone": "Phone number must be exactly 10 digits",
    "birthday": "Birthday must be a date in the past"
  }
}
```

#### HTTP 409 Conflict (Duplicate Code/Email/Phone)
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## 6. Update Student

Update details of an existing student.

- **URL**: `/api/v1/students/{id}`
- **Method**: `PUT`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The student's ID)

### Request Payload (JSON)
```json
{
  "fullName": "Nguyen Van A Edited",
  "email": "vana_new@gmail.com",
  "phone": "0912345678",
  "birthday": "2004-01-15",
  "gender": "MALE",
  "address": "Ho Chi Minh City, Dist 1",
  "status": "ACTIVE",
  "departmentId": "60c72b2f9b1d8b2bad000003",
  "classroomId": "60c72b2f9b1d8b2bad000005"
}
```

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000007",
    "studentCode": "SV001",
    "fullName": "Nguyen Van A Edited",
    "email": "vana_new@gmail.com",
    "phone": "0912345678",
    "birthday": "2004-01-15",
    "gender": "MALE",
    "address": "Ho Chi Minh City, Dist 1",
    "status": "ACTIVE",
    "departmentId": "60c72b2f9b1d8b2bad000003",
    "classroomId": "60c72b2f9b1d8b2bad000005"
  }
}
```

---

## 7. Delete Student (Soft Delete)

Marks a student record as deleted without purging them from the database.

- **URL**: `/api/v1/students/{id}`
- **Method**: `DELETE`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The student's ID)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Student deleted successfully (Soft delete)"
}
```
