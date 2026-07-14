# User API

These endpoints manage user accounts, permissions, and roles. All endpoints in this API require authentication and are restricted to users with the **`ADMIN`** role.

---

## 1. Retrieve User List

Fetch a list of all registered accounts.

- **URL**: `/api/v1/users`
- **Method**: `GET`
- **Authentication Required**: Yes (`ADMIN` role only)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "60c72b2f9b1d8b2bad000001",
      "username": "admin",
      "fullName": "System Administrator",
      "email": "admin@studentmgmt.com",
      "role": "ADMIN",
      "enabled": true
    },
    {
      "id": "60c72b2f9b1d8b2bad000002",
      "username": "user",
      "fullName": "Regular User",
      "email": "user@studentmgmt.com",
      "role": "USER",
      "enabled": true
    }
  ]
}
```

---

## 2. Update User Role

Change the role assignment (e.g. promote USER to ADMIN).

- **URL**: `/api/v1/users/{id}/role`
- **Method**: `PUT`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The User's unique database ID)

### Request Payload (JSON)
```json
{
  "role": "ADMIN"
}
```

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "60c72b2f9b1d8b2bad000002",
    "username": "user",
    "fullName": "Regular User",
    "email": "user@studentmgmt.com",
    "role": "ADMIN",
    "enabled": true
  }
}
```

### Error Responses

#### HTTP 404 Not Found (User ID not found)
```json
{
  "success": false,
  "message": "User not found with id: 60c72b2f9b1d8b2bad999999"
}
```

---

## 3. Delete User

Delete a user account from the system.

- **URL**: `/api/v1/users/{id}`
- **Method**: `DELETE`
- **Authentication Required**: Yes (`ADMIN` role only)
- **Path Parameter**: `id` (The User's unique database ID)

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Error Responses

#### HTTP 404 Not Found (User ID not found)
```json
{
  "success": false,
  "message": "User not found with id: 60c72b2f9b1d8b2bad999999"
}
```
