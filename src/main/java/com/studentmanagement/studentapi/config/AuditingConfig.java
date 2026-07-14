package com.studentmanagement.studentapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing(auditorAwareRef = "mongoAuditAwareImpl")
public class AuditingConfig {
}
