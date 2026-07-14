# Deployment Domain (MongoDB)

The Deployment Domain outlines steps to compile, run, configure, and maintain the application in development or production.

---

## 1. Prerequisites

- **Java JDK 21**
- **Apache Maven 3.x+**
- **MongoDB Server** (or Docker to run database containers)

---

## 2. Installation & Run Instructions

### Step 1: Clone the Repository
```bash
git clone <repository_url>
cd student-management-api
```

### Step 2: Build the Application Package
Compile codebase and package into a JAR file:
```bash
mvn clean install
```

### Step 3: Start the Backend Service
Run via Spring Boot plugin:
```bash
mvn spring-boot:run
```
Or start via Docker Compose:
```bash
docker compose up -d
```

---

## 3. Environment Variables

The application can be configured via environmental variables:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `SPRING_DATA_MONGODB_URI` | MongoDB Connection URI string | `mongodb://localhost:27017/student_management` |
| `JWT_SECRET` | Secret key used to sign JWT tokens | `very_long_jwt_secret_key_string...` |
| `JWT_EXPIRE` | JWT duration validity in milliseconds | `86400000` (24 Hours) |

---

## 4. Database Setup

To seed the local database with sample data, use `mongoimport` utility:

```bash
mongoimport --uri="mongodb://localhost:27017/student_management" --collection=users --file=seeding/users.json --jsonArray --mode=upsert

mongoimport --uri="mongodb://localhost:27017/student_management" --collection=departments --file=seeding/departments.json --jsonArray --mode=upsert

mongoimport --uri="mongodb://localhost:27017/student_management" --collection=classrooms --file=seeding/classrooms.json --jsonArray --mode=upsert

mongoimport --uri="mongodb://localhost:27017/student_management" --collection=students --file=seeding/students.json --jsonArray --mode=upsert
```
*(The schema seeding files are available in `seeding/` directory).*
