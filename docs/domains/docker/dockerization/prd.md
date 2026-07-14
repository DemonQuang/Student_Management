# PRD: Docker Containerization Subtask (MongoDB)

## 1. Overview & Goal
Set up Docker configurations to package the Java application and orchestrate a multi-container local stack consisting of the API service, a MongoDB database, and Mongo Express.

---

## 2. Functional Requirements
1. **Application Packaging (`Dockerfile`)**:
   - Use `eclipse-temurin:21-jdk` as base image.
   - Copy built Maven package (`target/*.jar`) into container.
   - Configure entrypoint commands to run Java jar: `java -jar app.jar`.
2. **Environment Orchestration (`docker-compose.yml`)**:
   - Define a `mongodb` database container running MongoDB 6+ or latest.
   - Define a `mongo-express` container (web-based visual admin panel) linked to the database container.
   - Define a `student-api` backend container that builds local source code, maps port 8080, and accepts environmental variables for MongoDB connection strings and security configurations.
   - Setup correct startup dependencies (`depends_on` mongodb).

---

## 3. Configuration Details

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:latest
    container_name: student-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: adminpassword
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express:latest
    container_name: student-mongo-express
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: adminpassword
      ME_CONFIG_MONGODB_SERVER: mongodb
    depends_on:
      - mongodb

  student-api:
    build: .
    container_name: student-api-service
    ports:
      - "8080:8080"
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://admin:adminpassword@mongodb:27017/student_management?authSource=admin
      JWT_SECRET: your_very_long_secret_key_with_at_least_256_bits_for_security_reasons_12345
      JWT_EXPIRE: 86400000 # 24 hours
    depends_on:
      - mongodb

volumes:
  mongo_data:
```

---

## 4. Acceptance Criteria
- [ ] Running `docker compose up --build` compiles and starts the entire application stack.
- [ ] Database data is persistent across container restarts.
- [ ] Backend API connects successfully to the MongoDB container on startup.
- [ ] Mongo Express is accessible locally at `http://localhost:8081` and allows visual access to collections.
