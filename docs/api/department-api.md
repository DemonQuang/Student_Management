# Department API

These endpoints manage academic departments. Deletion operations are protected and enforce department checks.

---

## 1. Retrieve Department List

Get a list of all active departments.

- **URL**: `/api/v1/departments`
- **Method**: `GET`
- **Authentication Required**: Yes (`USER` or `ADMIN` role)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": [
    {
      "id": "60c72b2f9b1d8b2bad000003",
      "name": "Information Technology",
      "createdAt": "2026-07-13T10:00:00Z"
    },
    {
      "id": "60c72b2f9b1d8b2bad000004",
      "name": "Business Administration",
      "createdAt": "2026-07-13T10:05:00Z"
    }
  ]
}
```

---

## 2. Create Department

Create a new department.

- **URL**: `/api/v1/departments`
- **Method**: `POST`
- **Authentication Required**: Yes (`ADMIN` role only)

### Request Payload (JSON)
```json
{
  "name": "Mechanical Engineering"
}
```

### Success Response (HTTP 201 Created)
```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000010",
    "name": "Mechanical Engineering",
    "createdAt": "2026-07-13T17:10:00Z"
  }
}
```

### Error Responses

#### HTTP 409 Conflict (Department name already exists)
```json
{
  "success": false,
  "message": "Department name already exists"
}
```

---

## 3. Update Department

Update an existing department's name.

- **URL**: `/api/v1/departments/{id}`
- **Method**: `PUT`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The department's ID)

### Request Payload (JSON)
```json
{
  "name": "Mechanical & Aerospace Engineering"
}
```

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Department updated successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000010",
    "name": "Mechanical & Aerospace Engineering",
    "createdAt": "2026-07-13T17:10:00Z"
  }
}
```

---

## 4. Delete Department

Delete a department. This action will fail if the department contains active classrooms.

- **URL**: `/api/v1/departments/{id}`
- **Method**: `DELETE`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The department's ID)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Department deleted successfully"
}
```

### Error Responses

#### HTTP 400 Bad Request (Department contains classrooms)
```json
{
  "success": false,
  "message": "Cannot delete department: There are classrooms belonging to this department."
}
```

#### HTTP 404 Not Found (Department ID not found)
```json
{
  "success": false,
  "message": "Department not found with ID: 60c72b2f9b1d8b2bad999999"
}
```
