# Functional Specification: Local Deployment & Configuration

## 1. Functional Overview
Deploy and verify the system locally, setting environment credentials and importing initial dataset tables using the `mongoimport` database seeding utility.

---

## 2. Environment Configurations Setup

The application reads credentials at startup. Make sure environmental keys are configured on the deployment host:
- `SPRING_DATA_MONGODB_URI`: Connection details to the MongoDB cluster.
- `JWT_SECRET`: Signing secret string (min 32 characters).
- `JWT_EXPIRE`: Token validity in milliseconds.

---

## 3. Operational Workflow

1. **Verify Database**: Start local MongoDB database instance (listening on port 27017).
2. **Execute Seeding**:
   - Locate the target json records in the `seeding/` directory.
   - Run the import commands to populate initial users, departments, classrooms, and student documents.
3. **Maven Compilation**: Build the package using `mvn clean install` to run tests and package the runnable JAR.
4. **App Execution**: Run `mvn spring-boot:run` to launch the API on port `8080`.
5. **Verify Access**: Open Swagger UI or invoke the login API with default credentials to retrieve access tokens.
