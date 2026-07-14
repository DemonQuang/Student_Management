# Functional Specification: Docker Containerization

## 1. Functional Overview
Deploy the Spring Boot API, MongoDB database, and Mongo Express administrator console in isolated Docker containers mapping system services to local machine ports.

---

## 2. Ports and Routing Configurations

| Service Container | Internal Port | Exposed Host Port | Access URI | Description |
| :--- | :--- | :--- | :--- | :--- |
| `student-api` | `8080` | `8080` | `http://localhost:8080` | The backend REST API. |
| `mongodb` | `27017` | `27017` | `mongodb://localhost:27017` | NoSQL Database storage. |
| `mongo-express` | `8081` | `8081` | `http://localhost:8081` | Database UI manager. |

---

## 3. Operational Workflow

1. **Compile & Package**: Trigger Maven build `mvn clean install` to generate `app.jar`.
2. **Build Image**: Call `docker compose up --build -d`.
   - Compiles local `Dockerfile`.
   - Downloads official base images (`mongo`, `mongo-express`).
3. **Database Bootstrap**:
   - `mongodb` service starts.
   - Attaches volume `mongo_data` to `/data/db`.
4. **App Initialization**:
   - `student-api` connects to database container using internal Docker DNS `mongodb:27017`.
   - Starts JVM and listens on port 8080.
