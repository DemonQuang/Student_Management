# Functional Specification: Swagger OpenAPI Setup

## 1. Functional Overview
Enable developers to view API documentation and manually execute request trials directly from a web UI console.

---

## 2. API Console Route Specifications

- **Documentation Metadata Route**: `/v3/api-docs` (returns OpenAPI raw JSON specification).
- **Web UI Access Route**: `/swagger-ui/index.html` (resolves to dynamic HTML console).
- **Default Authentication Policy**: Public.

---

## 3. Operational Workflow

1. **Scan Phase**: SpringDoc intercepts application startup, reading Controller classes and routing mappings.
2. **Metadata Compilation**:
   - Compiles route definitions, schemas (request DTO models), and security schemes.
   - Generates JSON OpenAPI specification.
3. **Rendering UI**:
   - Navigating to `/swagger-ui/index.html` loads the client bundle.
   - Fetches `/v3/api-docs` to render API endpoints list.
4. **Authorize Request**:
   - Developer logs in via `/api/v1/auth/login` to retrieve JWT.
   - Clicks "Authorize" button, pasting token as Bearer token.
   - Subsequent calls from Swagger console append header: `Authorization: Bearer <Token>`.
