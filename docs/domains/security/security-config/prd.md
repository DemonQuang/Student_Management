# PRD: Security Configuration Subtask

## 1. Overview & Goal
Configure the application security rules, stateless session policy, password encryption bean, and endpoint authorization access using Spring Security.

---

## 2. Technical Context
As an application architect, I want to secure all API endpoints except public routes (login/register) to prevent unauthorized resource accesses.

---

## 3. Functional Requirements

### Configurations
1. **Password Encoding**: Define a `BCryptPasswordEncoder` bean for hashing and matching user passwords.
2. **Session Policy**: Set Session Creation Policy to `SessionCreationPolicy.STATELESS`. The server must not store sessions.
3. **Endpoint Security Rules**:
   - `POST /api/v1/auth/login` -> permitAll()
   - `POST /api/v1/auth/register` -> permitAll()
   - `/swagger-ui/**`, `/v3/api-docs/**` -> permitAll()
   - `/api/v1/users/**` -> hasRole('ADMIN')
   - Write actions (`POST`, `PUT`, `DELETE`) on student, department, classroom -> hasRole('ADMIN')
   - Read actions (`GET`) on student, department, classroom -> hasAnyRole('USER', 'ADMIN')
   - Any other request -> authenticated()
4. **Cors & Csrf**: Disable CSRF as the application is stateless and uses JWT. Configure CORS if necessary.

---

## 4. Acceptance Criteria
- [ ] Requests to public endpoints succeed without credentials.
- [ ] Unauthenticated requests to secured endpoints return HTTP 401.
- [ ] A USER account trying to perform write actions (e.g. create student) receives HTTP 403 Forbidden.
- [ ] User passwords saved in database are hashed with BCrypt.
