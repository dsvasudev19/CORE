package com.dev.core.specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

/**
 * A reusable builder for creating dynamic JPA Specifications
 * for filtering, searching, and pagination.
 *
 * Usage Example:
 *   Specification<User> spec = SpecificationBuilder.of(User.class)
 *       .contains("username", "john")
 *       .equals("status", UserStatus.ACTIVE)
 *       .between("createdAt", start, end)
 *       .build();
 */
public class SpecificationBuilder<T> {

    private final List<SearchCriteria> params = new ArrayList<>();

    private SpecificationBuilder() {}

    public static <T> SpecificationBuilder<T> of(Class<T> clazz) {
        return new SpecificationBuilder<>();
    }

    // ----- Fluent Methods -----

    public SpecificationBuilder<T> equals(String key, Object value) {
        params.add(new SearchCriteria(key, SearchOperation.EQUAL, value, null));
        return this;
    }

    public SpecificationBuilder<T> notEquals(String key, Object value) {
        params.add(new SearchCriteria(key, SearchOperation.NOT_EQUAL, value, null));
        return this;
    }

    public SpecificationBuilder<T> contains(String key, String value) {
        params.add(new SearchCriteria(key, SearchOperation.CONTAINS, value, null));
        return this;
    }

    public SpecificationBuilder<T> startsWith(String key, String value) {
        params.add(new SearchCriteria(key, SearchOperation.STARTS_WITH, value, null));
        return this;
    }

    public SpecificationBuilder<T> endsWith(String key, String value) {
        params.add(new SearchCriteria(key, SearchOperation.ENDS_WITH, value, null));
        return this;
    }

    public SpecificationBuilder<T> greaterThan(String key, Object value) {
        params.add(new SearchCriteria(key, SearchOperation.GREATER_THAN, value, null));
        return this;
    }

    public SpecificationBuilder<T> lessThan(String key, Object value) {
        params.add(new SearchCriteria(key, SearchOperation.LESS_THAN, value, null));
        return this;
    }

    public SpecificationBuilder<T> between(String key, Object from, Object to) {
        params.add(new SearchCriteria(key, SearchOperation.BETWEEN, from, to));
        return this;
    }

    public SpecificationBuilder<T> in(String key, Collection<?> values) {
        params.add(new SearchCriteria(key, SearchOperation.IN, values, null));
        return this;
    }

    public SpecificationBuilder<T> isNull(String key) {
        params.add(new SearchCriteria(key, SearchOperation.NULL, null, null));
        return this;
    }

    public SpecificationBuilder<T> isNotNull(String key) {
        params.add(new SearchCriteria(key, SearchOperation.NOT_NULL, null, null));
        return this;
    }

    // ----- Build Method -----
    public Specification<T> build() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            for (SearchCriteria criteria : params) {
                String key = criteria.getKey();
                Path<?> path = getPath(root, key);

                switch (criteria.getOperation()) {
                    case EQUAL:
                        predicates.add(cb.equal(path, criteria.getValue()));
                        break;
                    case NOT_EQUAL:
                        predicates.add(cb.notEqual(path, criteria.getValue()));
                        break;
                    case GREATER_THAN:
                        predicates.add(cb.greaterThan(path.as(String.class), criteria.getValue().toString()));
                        break;
                    case LESS_THAN:
                        predicates.add(cb.lessThan(path.as(String.class), criteria.getValue().toString()));
                        break;
                    case BETWEEN:
                        if (criteria.getValue() instanceof LocalDateTime && criteria.getValueTo() instanceof LocalDateTime) {
                            predicates.add(cb.between(path.as(LocalDateTime.class),
                                    (LocalDateTime) criteria.getValue(),
                                    (LocalDateTime) criteria.getValueTo()));
                        } else {
                            predicates.add(cb.between(path.as(String.class),
                                    criteria.getValue().toString(),
                                    criteria.getValueTo().toString()));
                        }
                        break;
                    case CONTAINS:
                        predicates.add(cb.like(cb.lower(path.as(String.class)),
                                "%" + criteria.getValue().toString().toLowerCase() + "%"));
                        break;
                    case STARTS_WITH:
                        predicates.add(cb.like(cb.lower(path.as(String.class)),
                                criteria.getValue().toString().toLowerCase() + "%"));
                        break;
                    case ENDS_WITH:
                        predicates.add(cb.like(cb.lower(path.as(String.class)),
                                "%" + criteria.getValue().toString().toLowerCase()));
                        break;
                    case IN:
                        CriteriaBuilder.In<Object> inClause = cb.in(path);
                        ((Collection<?>) criteria.getValue()).forEach(inClause::value);
                        predicates.add(inClause);
                        break;
                    case NULL:
                        predicates.add(cb.isNull(path));
                        break;
                    case NOT_NULL:
                        predicates.add(cb.isNotNull(path));
                        break;
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Support nested field access like "role.name" or "organization.code"
    private Path<?> getPath(Root<?> root, String key) {
        if (!key.contains(".")) {
            return root.get(key);
        }
        String[] parts = key.split("\\.");
        Path<?> path = root.get(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            path = path.get(parts[i]);
        }
        return path;
    }
}
