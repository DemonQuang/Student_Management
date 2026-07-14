# MongoDB Seed Data

This document provides sample JSON documents and `mongoimport` shell commands to populate the MongoDB database for local development and testing.

---

## 1. Collection Seed Files

Create these JSON files locally inside a `seeding/` directory.

### `users.json`
```json
[
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000001" },
    "username": "admin",
    "password": "$2a$10$r9z1b98K1823y0C.u.14h30L.u12fQ32fXm13h1L2W.jU3aM9Gve",
    "fullName": "System Administrator",
    "email": "admin@studentmgmt.com",
    "role": "ADMIN",
    "enabled": true
  },
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000002" },
    "username": "user",
    "password": "$2a$10$r9z1b98K1823y0C.u.14h30L.u12fQ32fXm13h1L2W.jU3aM9Gvd",
    "fullName": "Regular User",
    "email": "user@studentmgmt.com",
    "role": "USER",
    "enabled": true
  }
]
```

### `departments.json`
```json
[
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000003" },
    "name": "Information Technology",
    "createdAt": { "$date": "2026-07-13T10:00:00Z" },
    "createdBy": "admin"
  },
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000004" },
    "name": "Business Administration",
    "createdAt": { "$date": "2026-07-13T10:05:00Z" },
    "createdBy": "admin"
  }
]
```

### `classrooms.json`
```json
[
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000005" },
    "name": "Class IT-01",
    "departmentId": { "$oid": "60c72b2f9b1d8b2bad000003" },
    "createdAt": { "$date": "2026-07-13T10:10:00Z" },
    "createdBy": "admin"
  },
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000006" },
    "name": "Class BA-01",
    "departmentId": { "$oid": "60c72b2f9b1d8b2bad000004" },
    "createdAt": { "$date": "2026-07-13T10:12:00Z" },
    "createdBy": "admin"
  }
]
```

### `students.json`
```json
[
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000007" },
    "studentCode": "SV001",
    "fullName": "Nguyen Van A",
    "email": "vana@gmail.com",
    "phone": "0912345678",
    "birthday": { "$date": "2004-01-15T00:00:00Z" },
    "gender": "MALE",
    "address": "Ho Chi Minh City",
    "status": "ACTIVE",
    "departmentId": { "$oid": "60c72b2f9b1d8b2bad000003" },
    "classroomId": { "$oid": "60c72b2f9b1d8b2bad000005" },
    "deleted": false,
    "createdAt": { "$date": "2026-07-13T10:15:00Z" },
    "createdBy": "admin"
  },
  {
    "_id": { "$oid": "60c72b2f9b1d8b2bad000008" },
    "studentCode": "SV002",
    "fullName": "Tran Thi B",
    "email": "thib@gmail.com",
    "phone": "0987654321",
    "birthday": { "$date": "2004-05-20T00:00:00Z" },
    "gender": "FEMALE",
    "address": "Hanoi",
    "status": "ACTIVE",
    "departmentId": { "$oid": "60c72b2f9b1d8b2bad000003" },
    "classroomId": { "$oid": "60c72b2f9b1d8b2bad000005" },
    "deleted": false,
    "createdAt": { "$date": "2026-07-13T10:16:00Z" },
    "createdBy": "admin"
  }
]
```

---

## 2. Importing Seed Data

You can use the standard MongoDB database utility `mongoimport` to load these files:

```bash
# Import Users
mongoimport --uri="mongodb://localhost:27017/student_management" --collection=users --file=seeding/users.json --jsonArray --mode=upsert

# Import Departments
mongoimport --uri="mongodb://localhost:27017/student_management" --collection=departments --file=seeding/departments.json --jsonArray --mode=upsert

# Import Classrooms
mongoimport --uri="mongodb://localhost:27017/student_management" --collection=classrooms --file=seeding/classrooms.json --jsonArray --mode=upsert

# Import Students
mongoimport --uri="mongodb://localhost:27017/student_management" --collection=students --file=seeding/students.json --jsonArray --mode=upsert
```
*(The `--jsonArray` option imports documents defined in a JSON array. `--mode=upsert` updates existing records with matching `_id` values, ensuring the command is idempotent).*
