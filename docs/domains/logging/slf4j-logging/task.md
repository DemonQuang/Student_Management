# Task Checklist: Centralized Logging (SLF4J)

This checklist tracks the development tasks required to implement operational logging.

---

## 1. Setup & Configuration
- [ ] Create `logback-spring.xml` file inside `src/main/resources/`.
- [ ] Add `ConsoleAppender` configuration mapping output patterns.
- [ ] Add `RollingFileAppender` configuration pointing to `logs/application.log`.
- [ ] Add rolling policies with `maxFileSize` (10MB) and `maxHistory` (30 days) limits.
- [ ] Set root level configuration to `INFO`.

## 2. Implementation
- [ ] Add Lombok `@Slf4j` annotation to service/controller classes.
- [ ] Write `log.info()` statements inside controllers/services to track user operations (e.g. login, student creations).
- [ ] Write `log.warn()` statements inside validation checkpoints.
- [ ] Write `log.error()` statements in error handlers to capture stack traces.
