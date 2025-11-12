package com.dev.core.mapper.bug;

import com.dev.core.domain.BugHistory;
import com.dev.core.model.bug.BugHistoryDTO;

public class BugHistoryMapper {

    private BugHistoryMapper() {}

    public static BugHistoryDTO toDTO(BugHistory entity) {
        if (entity == null) return null;

        return BugHistoryDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .changedField(entity.getChangedField())
                .oldValue(entity.getOldValue())
                .newValue(entity.getNewValue())
                .changedBy(entity.getChangedBy())
                .changedAt(entity.getChangedAt())
                .note(entity.getNote())
                .bugId(entity.getBug() != null ? entity.getBug().getId() : null)
                .build();
    }

    public static BugHistory toEntity(BugHistoryDTO dto) {
        if (dto == null) return null;

        BugHistory entity = new BugHistory();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setChangedField(dto.getChangedField());
        entity.setOldValue(dto.getOldValue());
        entity.setNewValue(dto.getNewValue());
        entity.setChangedBy(dto.getChangedBy());
        entity.setChangedAt(dto.getChangedAt());
        entity.setNote(dto.getNote());
        return entity;
    }
}
