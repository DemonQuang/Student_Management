# Task Checklist: Security Configurations

This checklist tracks the development tasks required to implement the Spring Security configurations.

---

## 1. Dependencies Setup
- [ ] Add `spring-boot-starter-security` in `pom.xml`.

## 2. Configuration Class Setup
- [ ] Create `SecurityConfig` configuration class.
- [ ] Configure `BCryptPasswordEncoder` bean.
- [ ] Configure `AuthenticationManager` bean.

## 3. Filters & Mappings Setup
- [ ] Configure Session Creation Policy to `SessionCreationPolicy.STATELESS`.
- [ ] Setup `SecurityFilterChain` permitting public endpoints and restricting other HTTP methods according to the Role-Based Access Control matrix.
- [ ] Inject custom JWT Filter before the default UsernamePasswordAuthenticationFilter.
