# RFC: Search & Filter Query Design (MongoDB)

## 1. Technical Objective
Specify dynamic query assembly using Spring Data MongoDB `Query` and `Criteria` to implement keyword search and multi-attribute filters.

---

## 2. Dynamic Query Builder Implementation

### `StudentSpecificationBuilder` or Custom Service Method
The dynamic query is built in the service layer using `MongoTemplate`:

```java
@Service
public class StudentQueryServiceImpl implements StudentQueryService {

    private final MongoTemplate mongoTemplate;

    public StudentQueryServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<StudentResponse> searchAndFilterStudents(String keyword, 
                                                         String departmentId, 
                                                         String classroomId, 
                                                         String gender, 
                                                         String status) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // 1. Soft-Delete Guard
        criteriaList.add(Criteria.where("deleted").is(false));

        // 2. Keyword Search (OR operator on fullName, studentCode, email)
        if (StringUtils.hasText(keyword)) {
            Criteria search = new Criteria().orOperator(
                Criteria.where("fullName").regex(keyword, "i"),
                Criteria.where("studentCode").regex(keyword, "i"),
                Criteria.where("email").regex(keyword, "i")
            );
            criteriaList.add(search);
        }

        // 3. Multi-Criteria Filters (AND operators)
        if (StringUtils.hasText(departmentId)) {
            criteriaList.add(Criteria.where("departmentId").is(new ObjectId(departmentId)));
        }
        if (StringUtils.hasText(classroomId)) {
            criteriaList.add(Criteria.where("classroomId").is(new ObjectId(classroomId)));
        }
        if (StringUtils.hasText(gender)) {
            criteriaList.add(Criteria.where("gender").is(gender));
        }
        if (StringUtils.hasText(status)) {
            criteriaList.add(Criteria.where("status").is(status));
        }

        // Assemble criteria
        query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));

        // Execute query
        List<Student> students = mongoTemplate.find(query, Student.class);

        // Map to Response DTOs
        return students.stream()
                       .map(student -> mapToResponse(student))
                       .collect(Collectors.toList());
    }
}
```

---

## 3. Query Performance & Indexing
- Searches use regular expressions (`regex(keyword, "i")`). To prevent full table scans:
  - Add compound indexes or individual text indexes on `fullName`, `studentCode`, and `email` if collection size is large.
  - The query always uses `deleted: false` which is indexed as a filter index or composite prefix.
