
package com.dev.core.mapper.performance;

import com.dev.core.domain.performance.PerformanceCycle;
import com.dev.core.model.performance.PerformanceCycleDTO;

public final class PerformanceCycleMapper {

    private PerformanceCycleMapper() {}

    public static PerformanceCycleDTO toDTO(PerformanceCycle entity) {
        if (entity == null) return null;

        return PerformanceCycleDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .year(entity.getYear())
                .quarter(entity.getQuarter())
                .active(entity.getActive())
                .startedAt(entity.getStartedAt())
                .endedAt(entity.getEndedAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public static PerformanceCycle toEntity(PerformanceCycleDTO dto) {
        if (dto == null) return null;

        PerformanceCycle e = new PerformanceCycle();
        if (dto.getId() != null) e.setId(dto.getId());
        e.setOrganizationId(dto.getOrganizationId());
        e.setYear(dto.getYear());
        e.setQuarter(dto.getQuarter());
        e.setActive(dto.getActive() == null ? Boolean.TRUE : dto.getActive());
        e.setStartedAt(dto.getStartedAt());
        e.setEndedAt(dto.getEndedAt());
        // createdAt/updatedAt handled by JPA auditing
        return e;
    }
}
