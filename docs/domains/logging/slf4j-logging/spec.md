# Functional Specification: Centralized Logging (SLF4J)

## 1. Functional Overview
Establish application-wide system operation logs, business transaction audits, and exception tracking using the SLF4J logging API.

---

## 2. Logger Specifications

- **Output Targets**:
  - Standard Out (`ConsoleAppender`).
  - File on Disk: `logs/application.log` (`RollingFileAppender`).
- **File Rotation Rules**:
  - Roll daily or when file size exceeds `10MB`.
  - Retain archived files for `30 days`.
  - Max storage limit cap: `1GB`.
- **Log Entry Pattern**:
  `[Timestamp] [Thread Name] [Log Level] [Class Name] - [Log Message]`

---

## 3. Operational Workflow

1. **Transaction Trigger**: Client performs an API action (e.g. calls `POST /api/v1/students`).
2. **Log Emitting**:
   - In controllers/services, calls `log.info()`, `log.warn()`, or `log.error()`.
   - Logging configurations intercept calls and direct output.
3. **Rotation Interception**: If active log size exceeds `10MB`, archive the file and initialize a clean `application.log`.
