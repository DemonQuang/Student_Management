# Database Design (MongoDB)

This document details the document-oriented database schema design for the Student Management System.

---

## 1. Schema Paradigm

The system utilizes MongoDB as a document database. Instead of traditional SQL tables and foreign keys, the data is modeled as collections containing BSON/JSON documents. Relationships are established using field references (`ObjectId`).

---

## 2. Collections & Document Schemas

### `users` Collection
Stores credentials and role identifiers for authentication and authorization.

```json
{
  "_id": "ObjectId",
  "username": "String (unique, required)",
  "password": "String (BCrypt hash, required)",
  "fullName": "String (required)",
  "email": "String (unique, required)",
  "role": "String (required, e.g. 'ADMIN' or 'USER')",
  "enabled": "Boolean (required, default true)"
}
```

---

### `departments` Collection
Stores department details.

```json
{
  "_id": "ObjectId",
  "name": "String (unique, required)",
  "createdAt": "Date (required)",
  "updatedAt": "Date (optional)",
  "createdBy": "String (optional)",
  "updatedBy": "String (optional)"
}
```

---

### `classrooms` Collection
Stores classroom details, referencing a parent department.

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "departmentId": "ObjectId (required, references departments._id)",
  "createdAt": "Date (required)",
  "updatedAt": "Date (optional)",
  "createdBy": "String (optional)",
  "updatedBy": "String (optional)"
}
```

---

### `students` Collection
Stores student records, referencing department and classroom.

```json
{
  "_id": "ObjectId",
  "studentCode": "String (unique, required)",
  "fullName": "String (required)",
  "email": "String (unique, required)",
  "phone": "String (unique, required)",
  "birthday": "Date (required)",
  "gender": "String (required, e.g., 'MALE', 'FEMALE', 'OTHER')",
  "address": "String (optional)",
  "status": "String (required, e.g., 'ACTIVE', 'INACTIVE', 'GRADUATED', 'SUSPENDED')",
  "departmentId": "ObjectId (required, references departments._id)",
  "classroomId": "ObjectId (required, references classrooms._id)",
  "deleted": "Boolean (required, default false)",
  "createdAt": "Date (required)",
  "updatedAt": "Date (optional)",
  "createdBy": "String (optional)",
  "updatedBy": "String (optional)"
}
```

---

## 3. Index Configurations

To optimize performance and enforce validation:
1. **`users`**: Unique index on `{ "username": 1 }` and `{ "email": 1 }`.
2. **`departments`**: Unique index on `{ "name": 1 }`.
3. **`students`**: Unique index on `{ "studentCode": 1 }`, `{ "email": 1 }`, and `{ "phone": 1 }`.
4. **`classrooms`**: Index on `{ "departmentId": 1 }` to optimize joins.
