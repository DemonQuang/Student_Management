# Functional Specification: Query Student

## 1. Functional Overview
Enable authenticated users (`USER` and `ADMIN` roles) to retrieve student lists with pagination, sorting, keyword searches, and multi-attribute filters.

---

## 2. API Contract & Parameters

### Paginated List (`GET /api/v1/students`)
- `page`: Page index (default: `0`).
- `size`: Documents count per page (default: `10`).
- `sort`: Sorting field (default: `"id"`).
- `direction`: Sort direction (`"asc"` or `"desc"`, default: `"asc"`).

### Keyword Search (`GET /api/v1/students/search`)
- `keyword`: Text query (required). Matches `fullName` (partial), `studentCode` (exact/partial), and `email` (partial/exact).

### Multi-Criteria Filters (`GET /api/v1/students/filter`)
- `departmentId`: Filter by department referenced `ObjectId` (optional).
- `classroomId`: Filter by classroom referenced `ObjectId` (optional).
- `gender`: Filter by exact gender enum value (optional).
- `status`: Filter by exact status enum value (optional).

---

## 3. Operational Workflow

1. **Parameters resolution**: Map query parameters. Ensure parameters values are within bounds (e.g. `size` is positive).
2. **Build query criteria**:
   - Always append condition `deleted = false`.
   - For keyword search, build an `OR` operation matching fields using regular expressions.
   - For filtering, check non-null parameter conditions and append them using `AND` operators.
3. **Execution**:
   - Query database. For list endpoints, execute a separate count query to compute total elements and pages.
4. **Respond**: Return mapped list or paginated response.

---

## 4. Response Scenarios

### Success Scenario (200 OK - Paginated List)
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": {
    "content": [
      {
        "id": "60c72b2f9b1d8b2bad000007",
        "studentCode": "SV001",
        "fullName": "Nguyen Van A",
        "email": "vana@gmail.com",
        "phone": "0912345678",
        "birthday": "2004-01-15",
        "gender": "MALE",
        "address": "Ho Chi Minh City",
        "status": "ACTIVE",
        "departmentId": "60c72b2f9b1d8b2bad000003",
        "classroomId": "60c72b2f9b1d8b2bad000005"
      }
    ],
    "pageNo": 0,
    "pageSize": 10,
    "totalElements": 1,
    "totalPages": 1,
    "last": true
  }
}
```
