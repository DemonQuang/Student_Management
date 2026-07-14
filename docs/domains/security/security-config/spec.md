# Functional Specification: Security Configurations

## 1. Functional Overview
Secure all API endpoints using Spring Security configurations, forcing authenticated requests for transactional endpoints and permitting anonymous calls on designated auth and document endpoints.

---

## 2. API Endpoint Protection Matrix

| Path Matcher | Allowed Methods | Required Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/**` | `POST` | PermitAll | Register & Login. |
| `/swagger-ui/**`, `/v3/api-docs/**` | `GET` | PermitAll | API documentation console. |
| `/api/v1/users/**` | `GET`, `PUT`, `DELETE`| `ADMIN` | User accounts administration. |
| `/api/v1/students/**` | `GET` | `USER`, `ADMIN` | Query, search, and filter student directories. |
| `/api/v1/students/**` | `POST`, `PUT`, `DELETE`| `ADMIN` | Modifications on student collections. |
| `/api/v1/departments/**` | `GET` | `USER`, `ADMIN` | Query academic departments list. |
| `/api/v1/departments/**` | `POST`, `PUT`, `DELETE`| `ADMIN` | Create, edit, delete departments. |
| `/api/v1/classrooms/**` | `GET` | `USER`, `ADMIN` | Query academic classrooms list. |
| `/api/v1/classrooms/**` | `POST`, `PUT`, `DELETE`| `ADMIN` | Create, edit, delete classrooms. |

---

## 3. Operational Workflow

1. **Request Interception**: Incoming requests are intercepted by Spring Security Filter Chain.
2. **Path Matching Verification**:
   - Check if path is matched under `PermitAll` lists. If yes, pass through.
   - If not in `PermitAll`, verify if request contains a valid JWT setting security context authentication. If missing or invalid, reject and return HTTP 401 Unauthorized.
3. **Role Checks**:
   - Verify if user's roles contains the required role mapped above. If missing, reject and return HTTP 403 Forbidden.
   - If roles match, proceed request execution to controller.
