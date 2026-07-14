# Task Checklist: Pagination & Sorting

This checklist tracks the development tasks required to implement data division.

---

## 1. DTO Wrapper Setup
- [ ] Create generic wrapper class `PageResponse<T>` containing `content`, `pageNo`, `pageSize`, `totalElements`, `totalPages`, and `last` properties.
- [ ] Implement static mapping method `fromPage(Page<E> page, List<D> dtos)` to translate Spring Data page models to DTO outputs.

## 2. Repository Layer
- [ ] Verify repositories inherit from `MongoRepository` (which extends `PagingAndSortingRepository`).

## 3. Service Layer
- [ ] Implement service logic receiving `Pageable` arguments and returning `PageResponse<T>`.

## 4. Controller Layer
- [ ] Setup default `@RequestParam` bindings (`page`, `size`, `sort`, `direction`) on list endpoints.
- [ ] Instantiate `PageRequest.of(page, size, Sort.by(...))` and pass to the service layer.
