# Classroom API

These endpoints manage classrooms linked to specific departments. Deletion operations are protected and enforce student checks.

---

## 1. Retrieve Classroom List

Get a list of all classrooms.

- **URL**: `/api/v1/classrooms`
- **Method**: `GET`
- **Authentication Required**: Yes (`USER` or `ADMIN` role)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Classrooms retrieved successfully",
  "data": [
    {
      "id": "60c72b2f9b1d8b2bad000005",
      "name": "Class IT-01",
      "departmentId": "60c72b2f9b1d8b2bad000003"
    },
    {
      "id": "60c72b2f9b1d8b2bad000006",
      "name": "Class BA-01",
      "departmentId": "60c72b2f9b1d8b2bad000004"
    }
  ]
}
```

---

## 2. Create Classroom

Create a new classroom.

- **URL**: `/api/v1/classrooms`
- **Method**: `POST`
- **Authentication Required**: Yes (`ADMIN` role only)

### Request Payload (JSON)
```json
{
  "name": "Class IT-03",
  "departmentId": "60c72b2f9b1d8b2bad000003"
}
```

### Success Response (HTTP 201 Created)
```json
{
  "success": true,
  "message": "Classroom created successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000011",
    "name": "Class IT-03",
    "departmentId": "60c72b2f9b1d8b2bad000003"
  }
}
```

### Error Responses

#### HTTP 400 Bad Request (Department ID does not exist)
```json
{
  "success": false,
  "message": "Department not found with ID: 60c72b2f9b1d8b2bad999999"
}
```

---

## 3. Update Classroom

Update classroom name or department link.

- **URL**: `/api/v1/classrooms/{id}`
- **Method**: `PUT`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The classroom ID)

### Request Payload (JSON)
```json
{
  "name": "Class IT-03 Edited",
  "departmentId": "60c72b2f9b1d8b2bad000003"
}
```

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Classroom updated successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000011",
    "name": "Class IT-03 Edited",
    "departmentId": "60c72b2f9b1d8b2bad000003"
  }
}
```

---

## 4. Delete Classroom

Delete a classroom. This action will fail if the classroom contains active students.

- **URL**: `/api/v1/classrooms/{id}`
- **Method**: `DELETE`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The classroom ID)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Classroom deleted successfully"
}
```

### Error Responses

#### HTTP 400 Bad Request (Classroom contains students)
```json
{
  "success": false,
  "message": "Cannot delete classroom: There are students enrolled in this classroom."
}
```

#### HTTP 404 Not Found (Classroom ID not found)
```json
{
  "success": false,
  "message": "Classroom not found with ID: 60c72b2f9b1d8b2bad999999"
}
```
