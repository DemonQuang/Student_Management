# PRD: Swagger OpenAPI Setup Subtask

## 1. Overview & Goal
Set up and configure Swagger OpenAPI v3 documentation interface for all API controllers to support developer verification and manual testing.

---

## 2. Functional Requirements
1. **Dependency Integration**: Import `springdoc-openapi-starter-webmvc-ui` in the project configuration.
2. **Access Path**: Expose the HTML interface at `http://localhost:8080/swagger-ui/index.html`.
3. **Security Integration**:
   - Define an OpenAPI customizer configuration to include support for Bearer Auth.
   - Configure a global `SecurityScheme` with type HTTP, scheme bearer, format JWT.
   - Attach this security scheme requirement to all non-public endpoints so the Swagger console can make authenticated requests using a user's logged-in token.
4. **API Descriptions**: Group endpoints and provide descriptions (e.g. tag student controllers as "Student Management").

---

## 3. Acceptance Criteria
- [ ] Navigating to the Swagger-UI path loads the interactive API list.
- [ ] Users can trigger public API requests (login/register) directly from the interface.
- [ ] Authorized calls return standard success payloads.
- [ ] Secured API requests fail with 401 until a valid JWT token is loaded in Swagger's "Authorize" panel.
