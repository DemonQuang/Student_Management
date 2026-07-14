# Task Checklist: Swagger OpenAPI Setup

This checklist tracks the development tasks required to implement the Swagger OpenAPI documentation console.

---

## 1. Setup & Configuration
- [ ] Add `springdoc-openapi-starter-webmvc-ui` in `pom.xml`.
- [ ] Create `OpenApiConfig` class inside configurations package.
- [ ] Define `studentManagementOpenAPI` bean customizing title, description, developer contacts, and security definitions.
- [ ] Add `bearerAuth` security scheme (type: HTTP, scheme: bearer, format: JWT).

## 2. Controller Documentation Customization
- [ ] Add `@Tag` annotations on Controllers to group endpoints (e.g. tag student controllers as "Student Management").
- [ ] Add `@Operation` annotations on endpoints mapping parameters, summary descriptions, and expected response statuses.
- [ ] Run application locally and verify Swagger console is accessible at `http://localhost:8080/swagger-ui/index.html`.
