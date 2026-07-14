# Task Checklist: Local Deployment & Configuration

This checklist tracks the development tasks required to configure and run the system locally.

---

## 1. Setup Property Configuration
- [ ] Map variables in `application.properties`:
  - `spring.data.mongodb.uri`
  - `security.jwt.secret`
  - `security.jwt.expiration`
- [ ] Document defaults in properties mapping.

## 2. Seeding Configuration Setup
- [ ] Create `seeding/` directory containing JSON seeds (`users.json`, `departments.json`, `classrooms.json`, `students.json`).
- [ ] Document `mongoimport` utility script commands to seed collections.

## 3. Verify Local Build & Deploy
- [ ] Run MongoDB daemon locally on port 27017.
- [ ] Execute seeding scripts.
- [ ] Run `mvn clean install` verifying package build.
- [ ] Run `mvn spring-boot:run` to launch the REST API on port `8080`.
- [ ] Test endpoints using Swagger Console.
