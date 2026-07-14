# PRD: Centralized Logging (SLF4J) Subtask

## 1. Overview & Goal
Set up application-wide structured logging to track business operations and record errors to console and file storage.

---

## 2. Functional Requirements
1. **Logging Framework**: Use SLF4J facade with Logback as the provider.
2. **Log File Output**:
   - Write logs to the console and to a local file: `logs/application.log`.
   - Implement log rotation (daily log rolling, max size limits e.g. 10MB per file, max history e.g. 30 days).
3. **Log Levels & Locations**:
   - **`INFO`**: In controllers and services to log startup actions, client logins, and transactional success (e.g. "Admin created student SV001").
   - **`WARN`**: To flag token validation errors or suspicious activities.
   - **`ERROR`**: Caught exceptions, database errors, and general failures (logged with stack traces).

---

## 3. Acceptance Criteria
- [ ] Running the application initializes the `logs/` directory and creates `application.log`.
- [ ] Successful client actions generate `INFO` logs with structured arguments.
- [ ] Validation exceptions or unauthorized errors write corresponding warnings/error logs.
- [ ] Log outputs contain timestamp, log level, thread name, class name, and message.
