# RFC: MongoDB Auditing Design

## 1. Technical Objective
Specify configurations, base entities, and auditor context resolvers to implement automatic document auditing in MongoDB.

---

## 2. Component Design & Methods

### Auditor Aware Implementation (`AuditConfig`)
```java
@Configuration
@EnableMongoAuditing
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return new SpringSecurityAuditorAware();
    }
}

class SpringSecurityAuditorAware implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || 
            !authentication.isAuthenticated() || 
            authentication instanceof AnonymousAuthenticationToken) {
            return Optional.of("system");
        }

        return Optional.of(authentication.getName());
    }
}
```

---

## 3. Base Document Mapping

Create an abstract base document class from which all collections extend:

```java
public abstract class BaseDocument {

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;

    // Getters and Setters
}
```

### Execution Flow
- On `save()` of a new document, Spring Data MongoDB automatically calls `SpringSecurityAuditorAware.getCurrentAuditor()` to fetch the username and populates `createdBy` and `createdAt`.
- On document modifications, Spring Data MongoDB automatically updates `updatedBy` and `updatedAt`.
