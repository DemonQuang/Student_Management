# Task Checklist: Unit Testing

This checklist tracks the development tasks required to implement service layer unit testing using JUnit 5 and Mockito.

---

## 1. Setup & Configuration
- [ ] Add `junit-jupiter-api`, `junit-jupiter-engine`, and `mockito-core` dependencies in `pom.xml` under test scope.
- [ ] Add `jacoco-maven-plugin` configuration inside `pom.xml` build plugins to track code coverage.

## 2. Test Classes Implementation
- [ ] Create `StudentServiceTest` class annotated with `@ExtendWith(MockitoExtension.class)`.
- [ ] Mock repositories: `StudentRepository`, `DepartmentRepository`, `ClassroomRepository` using `@Mock`.
- [ ] Inject mocked dependencies into `StudentServiceImpl` using `@InjectMocks`.
- [ ] Write success test cases mapping correct records retrieval and creation lookups.
- [ ] Write exception test cases asserting duplicates and missing reference handling.
- [ ] Repeat test classes creation for `AuthenticationServiceTest`.

## 3. Verification
- [ ] Run `mvn test` from terminal.
- [ ] Open target reports folder `target/site/jacoco/index.html` and verify overall line coverage exceeds `80%`.
