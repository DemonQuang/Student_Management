# RFC: Centralized Logging Design

## 1. Technical Objective
Specify configuration parameters and log patterns to implement operational logging using SLF4J and Logback.

---

## 2. Configuration Design (`logback-spring.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <property name="LOGS" value="./logs" />

    <appender name="Console" class="ch.qos.logback.core.ConsoleAppender">
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</Pattern>
        </layout>
    </appender>

    <appender name="RollingFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOGS}/application.log</file>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <Pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</Pattern>
        </encoder>

        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOGS}/archived/application-%d{yyyy-MM-day}.%i.log</fileNamePattern>
            <maxFileSize>10MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
    </appender>

    <root level="INFO">
        <appender-ref ref="Console" />
        <appender-ref ref="RollingFile" />
    </root>

</configuration>
```

---

## 3. Usage & Level Guidelines

- **Injecting Logger**: Use Lombok's `@Slf4j` annotation directly on service/controller classes.
- **Log Levels**:
  - `log.info("Admin created student: {}", studentCode);`
  - `log.warn("Unauthorized API call attempt on: {}", requestUri);`
  - `log.error("Failed to query user records: {}", exception.getMessage(), exception);`
