---
name: spring-service-testing
description: Adds focused tests for Spring services, REST controllers, and JPA repositories.
---

# Spring service testing

1. Cover business rules in service tests with mocked repositories and assert both the returned state and repository interactions.
2. Cover controller response shapes and status codes at the HTTP boundary; let Spring translate `ResponseStatusException` rather than duplicating business rules.
3. Use `@DataJpaTest` for derived queries and JPQL behavior, with distinct fixture values and the PostgreSQL test service used by CI.
4. Include boundary and rejected-transition cases for adoption workflows.
5. Run `./mvnw test` from `backend/` and report database or test failures explicitly.
