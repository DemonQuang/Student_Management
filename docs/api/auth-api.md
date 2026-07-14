# Authentication API

This API endpoints handle user registration, credential validation, and JWT token issuance.

---

## 1. Register User

Creates a new user account. By default, newly registered users are assigned the `USER` role.

- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Authentication Required**: No (PermitAll)

### Request Payload (JSON)
```json
{
  "username": "newuser",
  "password": "userpassword123",
  "fullName": "New User Display Name",
  "email": "newuser@example.com"
}
```

### Success Response (HTTP 201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 3,
    "username": "newuser",
    "fullName": "New User Display Name",
    "email": "newuser@example.com",
    "role": "USER",
    "enabled": true
  }
}
```

### Error Responses

#### HTTP 400 Bad Request (Validation failure)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email must be a well-formed email address",
    "username": "Username cannot be empty"
  }
}
```

#### HTTP 409 Conflict (Username/Email already exists)
```json
{
  "success": false,
  "message": "Username or Email is already taken"
}
```

---

## 2. Login User

Validates user credentials and returns a signed JWT token if authentication succeeds.

- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Authentication Required**: No (PermitAll)

### Request Payload (JSON)
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIs...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "role": "ADMIN"
  }
}
```

### Error Responses

#### HTTP 401 Unauthorized (Invalid username/password)
```json
{
  "success": false,
  "message": "Bad credentials / Invalid username or password"
}
```
