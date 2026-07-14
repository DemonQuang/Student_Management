# RFC: Local Deployment & Configuration Design

## 1. Technical Objective
Specify configuration key mapping, environment setups, database imports, and local build steps to implement project deployments.

---

## 2. Spring Application Properties Configuration

Configure connection strings in `src/main/resources/application.properties` (or `application.yml` equivalent) to load values dynamically from environment variables:

```properties
# Server configuration
server.port=${PORT:8080}

# MongoDB configuration
spring.data.mongodb.uri=${SPRING_DATA_MONGODB_URI:mongodb://localhost:27017/student_management}

# Logging configuration
logging.config=classpath:logback-spring.xml

# Security configurations
security.jwt.secret=${JWT_SECRET:default_development_jwt_secret_key_with_sufficient_bytes_32_characters}
security.jwt.expiration=${JWT_EXPIRE:86400000} # 24 hours
```

---

## 3. Database Seeding Execution Plan

During deployment verification, seed collections using the JSON templates:

1. **Verify MongoDB Connection**: Ensure local database daemon is active (`mongod` running on port `27017`).
2. **Execute Imports**:
   Run the following script or terminal commands inside the workspace root:
   ```bash
   # Navigate to workspace seeding folder
   cd seeding
   
   # Import collections
   mongoimport --db=student_management --collection=users --file=users.json --jsonArray --mode=upsert
   mongoimport --db=student_management --collection=departments --file=departments.json --jsonArray --mode=upsert
   mongoimport --db=student_management --collection=classrooms --file=classrooms.json --jsonArray --mode=upsert
   mongoimport --db=student_management --collection=students --file=students.json --jsonArray --mode=upsert
   ```
3. **Verify Data Seeding**:
   Connect via a shell client or Robo 3T / MongoDB Compass and run:
   ```javascript
   use student_management;
   db.users.find().pretty();
   ```
