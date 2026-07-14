# PRD: Pagination & Sorting Subtask

## 1. Overview & Goal
Define structural rules and utilities to support paginated queries and field sorting on data retrieval endpoints.

---

## 2. Functional Requirements
1. **Query Argument Mapping**:
   - Controller endpoints supporting pagination accept optional query parameters: `page`, `size`, `sort`, `direction`.
   - Convert these query parameters into a Spring Data `Pageable` instance using default fallback values:
     - `page = 0` (0-indexed first page)
     - `size = 10` (10 items per page)
     - `sort = id`
     - `direction = asc`
2. **Database Execution**:
   - Repository interfaces extend `PagingAndSortingRepository`.
   - Return queries wrapped in `Page<T>`.
3. **Response Payload Wrapper**:
   - Map `Page<T>` details to a custom paginated DTO structure:
     - `content`: Array of elements.
     - `pageNo`: Current page index.
     - `pageSize`: Items per page.
     - `totalElements`: Total matches in database.
     - `totalPages`: Total page count.
     - `last`: Boolean indicating if this is the final page.

---

## 3. Acceptance Criteria
- [ ] Querying paginated lists returns only the items belonging to that page range.
- [ ] Sorting parameters adjust the order of elements returned.
- [ ] Metadata fields (`totalElements`, `totalPages`) match actual database records count.
