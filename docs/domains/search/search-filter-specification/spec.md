# Functional Specification: Search & Filter MongoDB Queries

## 1. Functional Overview
Enable users to perform keyword search queries across names, codes, and emails, or apply structured filters on specific collection fields, excluding soft-deleted documents.

---

## 2. Parameter Processing Specifications

### Keyword Search
- Matches are executed using a regular expression: `.*keyword.*`, case-insensitive (`i` flag).
- Targets fields: `fullName`, `studentCode`, `email`.
- Condition: The fields are combined using logical `OR`.

### Multi-Criteria Filters
- Validates optional parameters: `departmentId`, `classroomId`, `gender`, `status`.
- Conditions are combined using logical `AND`.
- If a filter is absent or empty, it is skipped.

---

## 3. Operational Workflow

1. **Parameters Sanitization**: Validate ObjectId structures. If invalid string format is passed, return 400.
2. **Build Criteria**:
   - Force condition: `deleted == false`.
   - Append keyword criteria if provided.
   - Append field-level filters if provided.
3. **Execution**:
   - Invoke query using MongoTemplate.
4. **Respond**: Return DTO list.
