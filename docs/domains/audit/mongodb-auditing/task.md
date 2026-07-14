# Task Checklist: MongoDB Auditing

This checklist tracks the development tasks required to implement Spring Data MongoDB Auditing.

---

## 1. Context Resolution
- [ ] Create `SpringSecurityAuditorAware` class implementing `AuditorAware<String>`.
- [ ] Implement `getCurrentAuditor()` retrieving the username from Spring Security context (fallback to `"system"`).

## 2. Configuration Setup
- [ ] Create configuration bean class `AuditConfig` annotated with `@EnableMongoAuditing`.
- [ ] Register `auditorProvider()` bean.

## 3. Base Class Setup
- [ ] Create abstract class `BaseDocument`.
- [ ] Declare fields: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.
- [ ] Map fields using auditing annotations (`@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy`).
- [ ] Make entity document classes extend `BaseDocument`.
