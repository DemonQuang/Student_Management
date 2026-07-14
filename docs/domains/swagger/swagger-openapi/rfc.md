# RFC: Swagger OpenAPI Setup Design

## 1. Technical Objective
Specify configuration classes, UI mappings, and security integrations to implement OpenAPI documentation and dynamic testing.

---

## 2. Configuration Class Specification

Configure the OpenAPI metadata and global JWT security scheme:

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI studentManagementOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Student Management API")
                        .description("REST API for school student administration using MongoDB")
                        .version("v1.0.0")
                        .contact(new Contact().name("Fresher Java Backend Developer")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .name("bearerAuth")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
```

---

## 3. Controller Annotation Customization

Use OpenAPI annotations on Controller layers to organize documentation:

```java
@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Student Management", description = "Endpoints for creating, updating, searching, and deleting student records")
public class StudentController {

    @Operation(summary = "Get paginated students", description = "Returns active student documents using page size, page index, and sort constraints")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list"),
        @ApiResponse(responseCode = "401", description = "Unauthenticated request")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> getStudents(Pageable pageable) {
        // ...
    }
}
```
*(Annotated endpoints populate the Swagger Console dynamically, grouping operations under designated tags).*
