# RFC: Docker Containerization Design

## 1. Technical Objective
Specify Docker packaging, service ports, authentication variables, and volume configurations to implement containerized runtime environments.

---

## 2. Container Topology

The application environment consists of three interconnected containers run inside a single Docker Bridge Network:

```mermaid
graph TD
    Client[Client Browser / API Client] -->|Port 8080| API[Spring Boot Service Container]
    Client -->|Port 8081| PMA[Mongo Express Panel]
    API -->|Port 27017| DB[MongoDB Database Container]
    PMA -->|Port 27017| DB
    DB -->|volume| Vol[(mongo_data)]
```

---

## 3. Configuration Details

### MongoDB Environment Variable Configurations
- `MONGO_INITDB_ROOT_USERNAME`: `admin` (Root admin username)
- `MONGO_INITDB_ROOT_PASSWORD`: `adminpassword` (Root admin password)
- Persistent Volume Mount: `/data/db` mapped to the named Docker volume `mongo_data`.

### Mongo Express Environment Variables
- `ME_CONFIG_MONGODB_ADMINUSERNAME`: `admin`
- `ME_CONFIG_MONGODB_ADMINPASSWORD`: `adminpassword`
- `ME_CONFIG_MONGODB_SERVER`: `mongodb` (DNS matches the container service name)
- Port: `8081`

### Student API Environment Configurations
- `SPRING_DATA_MONGODB_URI`: `mongodb://admin:adminpassword@mongodb:27017/student_management?authSource=admin`
- `JWT_SECRET`: Loads from system configurations.
- Port: `8080`

---

## 4. Run Guide
Compile the package and build containers:
```bash
mvn clean install
docker compose up --build -d
```
Verify container statuses:
```bash
docker compose ps
```
To stop services:
```bash
docker compose down
```
