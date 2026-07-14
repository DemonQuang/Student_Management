# Task Checklist: Docker Containerization

This checklist tracks the development tasks required to implement the Docker container deployment.

---

## 1. Dockerfile Setup
- [ ] Create `Dockerfile` inside the workspace root.
- [ ] Declare base image: `FROM eclipse-temurin:21-jdk`.
- [ ] Add `COPY target/*.jar app.jar` statement.
- [ ] Declare `ENTRYPOINT ["java", "-jar", "app.jar"]`.

## 2. Docker Compose Setup
- [ ] Create `docker-compose.yml` inside the workspace root.
- [ ] Add `mongodb` service container configurations. Attach data volume.
- [ ] Add `mongo-express` service container configurations. Link to `mongodb`.
- [ ] Add `student-api` service container configurations. Bind compilation build to local directory, configure environment connection URIs, and link to `mongodb`.
- [ ] Declare named volume `mongo_data`.
