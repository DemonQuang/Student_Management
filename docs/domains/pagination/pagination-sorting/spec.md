# Functional Specification: Pagination & Sorting

## 1. Functional Overview
Enable paginated retrieval of large datasets, sorting by columns in ascending or descending order to optimize performance.

---

## 2. API Contract Specification

### Parameters
- **`page`**: 0-based page index (e.g. `page=0` is first page).
- **`size`**: Total number of items per page.
- **`sort`**: Entity field key to sort by.
- **`direction`**: Sort direction, restricted to `"asc"` or `"desc"`.

---

## 3. Operational Workflow

1. **Parameters Verification**:
   - Check request query parameters. If invalid, apply defaults.
2. **Database Execution**:
   - Call repository passing the `Pageable` object.
   - Execute the query using Mongo index limit/offsets.
   - Run a matching count query to resolve the total matches.
3. **Response Assembly**:
   - Pack content and add total records count, total pages, current index, and status flags.

---

## 4. Response Scenarios

### Success Scenario (200 OK)
- **Request**: `GET /api/v1/students?page=0&size=2&sort=studentCode&direction=desc`
- **Response**:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "content": [
      {
        "id": "60c72b2f9b1d8b2bad000008",
        "studentCode": "SV002",
        "fullName": "Tran Thi B"
      },
      {
        "id": "60c72b2f9b1d8b2bad000007",
        "studentCode": "SV001",
        "fullName": "Nguyen Van A"
      }
    ],
    "pageNo": 0,
    "pageSize": 2,
    "totalElements": 2,
    "totalPages": 1,
    "last": true
  }
}
```
