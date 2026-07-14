# RFC: Pagination & Sorting Design

## 1. Technical Objective
Specify parameter parsing, repository methods, and paginated JSON DTO wrappers to implement data division.

---

## 2. API Contract & Parameter Mapping

Endpoints supporting paginated lookups accept the following URL parameters:
- `page`: Page index (default: `0`).
- `size`: Count of documents per page (default: `10`).
- `sort`: Entity field name to sort (default: `"id"`).
- `direction`: Direction of sorting (default: `"asc"`).

### Controller Conversion Pattern
```java
@GetMapping
public ResponseEntity<ApiResponse<PageResponse<StudentResponse>>> getStudents(
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "10") int size,
        @RequestParam(value = "sort", defaultValue = "id") String sort,
        @RequestParam(value = "direction", defaultValue = "asc") String direction) {

    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sort));
    PageResponse<StudentResponse> data = studentService.getAllStudents(pageable);
    return ResponseEntity.ok(new ApiResponse<>(true, "Data retrieved successfully", data));
}
```

---

## 3. Data Structure & Mapping

The `PageResponse` DTO wraps output contents and pagination meta-fields:

```java
public class PageResponse<T> {
    private List<T> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public static <E, D> PageResponse<D> fromPage(Page<E> page, List<D> dtos) {
        PageResponse<D> response = new PageResponse<>();
        response.setContent(dtos);
        response.setPageNo(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());
        return response;
    }
}
```
*(Spring Data MongoDB `MongoRepository` automatically executes count queries alongside index query offsets when passing `Pageable` parameters).*
