# PRD: Unit Testing (JUnit 5 & Mockito) Subtask

## 1. Overview & Goal
Set up unit tests for the core business services (`StudentService` and `AuthenticationService`) using JUnit 5 and Mockito mock engines, targeted at mocking `MongoRepository`.

---

## 2. Functional Requirements
1. **Core Libraries**: Include JUnit 5 engine and Mockito dependencies in Maven `pom.xml`.
2. **Service Layer Mocking**:
   - Write tests extending `MockitoExtension`.
   - Mock repositories (`StudentRepository` extending `MongoRepository`, `UserRepository`, etc.) to isolate testing context and prevent database mutations.
   - Inject mocks automatically using Mockito annotations.
3. **Test Scenarios**:
   - **`StudentService`**:
     - Creating student with valid parameters (resolving mocked department and classroom lookups).
     - Validation/Constraint exception on duplicate values.
     - Querying active records, ensuring soft-deleted ones are not fetched.
     - Soft deletion updates.
   - **`AuthenticationService`**:
     - Login with correct passwords.
     - Failure modes on wrong passwords or missing accounts.
     - Registration uniqueness assertions.

---

## 3. Mocking Approach

Repository calls are mocked to ensure tests run fast and without database coupling:
```java
@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    @Test
    void testFindStudentById_Success() {
        Student student = new Student();
        student.setId("60c72b2f9b1d8b2bad000007");
        student.setStudentCode("SV001");
        student.setDeleted(false);
        
        Mockito.when(studentRepository.findByIdAndDeletedFalse("60c72b2f9b1d8b2bad000007"))
               .thenReturn(Optional.of(student));
               
        StudentResponse response = studentService.getStudentById("60c72b2f9b1d8b2bad000007");
        
        Assertions.assertNotNull(response);
        Assertions.assertEquals("SV001", response.getStudentCode());
    }
}
```

---

## 4. Acceptance Criteria
- [ ] Running `mvn test` compiles and executes the test suite.
- [ ] Service layer code coverage is tracked (e.g. via JaCoCo plugin) and meets the >80% threshold.
- [ ] All tests assert functional outcomes and pass successfully.
