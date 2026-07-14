# Functional Specification: Unit Testing

## 1. Functional Overview
Establish testing structures to execute isolated unit testing checks, asserting service layer logic using mock interfaces and verifying code quality with JaCoCo coverage reports.

---

## 2. Test Execution & Coverage Goals

- **Target Level**: Service layer (`StudentService`, `AuthenticationService`).
- **Target Coverage**: `> 80%` code lines.
- **Reporting format**: HTML report output to `target/site/jacoco/index.html`.

---

## 3. Operational Workflow

1. **Compilation Phase**: Maven compiles class directories and parses test classes.
2. **Mock Initialization**: Mockito initializes mock repositories and injects them into service classes under test.
3. **Execution**:
   - Runs mock behaviors mapping expected input-output.
   - Assert returns match predicted values.
4. **Coverage Calculation**: JaCoCo traces execution lines, reporting covered vs uncovered blocks.
