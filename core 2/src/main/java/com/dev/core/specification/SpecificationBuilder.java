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

public class SpecificationBuilder<T> {

    private final List<SearchCriteria> params = new ArrayList<>();

    private SpecificationBuilder() {}

    public static <T> SpecificationBuilder<T> of(Class<T> clazz) {
        return new SpecificationBuilder<>();
    }

    // ----- Fluent Methods -----

    public SpecificationBuilder<T> equals(String key, Object value) {
        if (value != null)
            params.add(new SearchCriteria(key, SearchOperation.EQUAL, value, null));
        return this;
    }

    public SpecificationBuilder<T> notEquals(String key, Object value) {
        if (value != null)
            params.add(new SearchCriteria(key, SearchOperation.NOT_EQUAL, value, null));
        return this;
    }

    public SpecificationBuilder<T> contains(String key, String value) {
        if (value != null && !value.isBlank())
            params.add(new SearchCriteria(key, SearchOperation.CONTAINS, value, null));
        return this;
    }

    public SpecificationBuilder<T> startsWith(String key, String value) {
        if (value != null && !value.isBlank())
            params.add(new SearchCriteria(key, SearchOperation.STARTS_WITH, value, null));
        return this;
    }

    public SpecificationBuilder<T> endsWith(String key, String value) {
        if (value != null && !value.isBlank())
            params.add(new SearchCriteria(key, SearchOperation.ENDS_WITH, value, null));
        return this;
    }

    public SpecificationBuilder<T> greaterThan(String key, Object value) {
        if (value != null)
            params.add(new SearchCriteria(key, SearchOperation.GREATER_THAN, value, null));
        return this;
    }

    public SpecificationBuilder<T> lessThan(String key, Object value) {
        if (value != null)
            params.add(new SearchCriteria(key, SearchOperation.LESS_THAN, value, null));
        return this;
    }

    public SpecificationBuilder<T> between(String key, Object from, Object to) {
        if (from != null && to != null)
            params.add(new SearchCriteria(key, SearchOperation.BETWEEN, from, to));
        return this;
    }

    public SpecificationBuilder<T> in(String key, Collection<?> values) {
        if (values != null && !values.isEmpty())
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
                Object value = criteria.getValue();
                Object valueTo = criteria.getValueTo();

                switch (criteria.getOperation()) {

                    case EQUAL:
                        predicates.add(cb.equal(path, value));
                        break;

                    case NOT_EQUAL:
                        predicates.add(cb.notEqual(path, value));
                        break;

                    case GREATER_THAN:
                        if (value != null)
                            predicates.add(cb.greaterThan(path.as(String.class), value.toString()));
                        break;

                    case LESS_THAN:
                        if (value != null)
                            predicates.add(cb.lessThan(path.as(String.class), value.toString()));
                        break;

                    case BETWEEN:
                        if (value instanceof LocalDateTime && valueTo instanceof LocalDateTime) {
                            predicates.add(cb.between(
                                    path.as(LocalDateTime.class),
                                    (LocalDateTime) value,
                                    (LocalDateTime) valueTo
                            ));
                        } else if (value != null && valueTo != null) {
                            predicates.add(cb.between(
                                    path.as(String.class),
                                    value.toString(),
                                    valueTo.toString()
                            ));
                        }
                        break;

                    case CONTAINS:
                        if (value != null)
                            predicates.add(cb.like(cb.lower(path.as(String.class)),
                                    "%" + value.toString().toLowerCase() + "%"));
                        break;

                    case STARTS_WITH:
                        if (value != null)
                            predicates.add(cb.like(cb.lower(path.as(String.class)),
                                    value.toString().toLowerCase() + "%"));
                        break;

                    case ENDS_WITH:
                        if (value != null)
                            predicates.add(cb.like(cb.lower(path.as(String.class)),
                                    "%" + value.toString().toLowerCase()));
                        break;

                    case IN:
                        if (value instanceof Collection<?> col && !col.isEmpty()) {
                            CriteriaBuilder.In<Object> inClause = cb.in(path);
                            col.forEach(inClause::value);
                            predicates.add(inClause);
                        }
                        break;

                    case NULL:
                        predicates.add(cb.isNull(path));
                        break;

                    case NOT_NULL:
                        predicates.add(cb.isNotNull(path));
                        break;
                }
            }

            return predicates.isEmpty()
                    ? cb.conjunction()
                    : cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Support nested fields: "assignedTo.id", "project.code", "owner.role.name"
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
