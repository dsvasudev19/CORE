package com.dev.core.mapper;

import com.dev.core.domain.Contact;
import com.dev.core.model.ContactDTO;

public class ContactMapper {

    public static ContactDTO toDTO(Contact entity) {
        if (entity == null) return null;

        return ContactDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .active(entity.getActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .designation(entity.getDesignation())
                .department(entity.getDepartment())
                .type(entity.getType())
                .notes(entity.getNotes())
                .build();
    }

    public static Contact toEntity(ContactDTO dto, Contact entity) {
        if (dto == null) return entity;
        if (entity == null) entity = new Contact();

        entity.setOrganizationId(dto.getOrganizationId());
        entity.setActive(dto.getActive());
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setDesignation(dto.getDesignation());
        entity.setDepartment(dto.getDepartment());
        entity.setType(dto.getType());
        entity.setNotes(dto.getNotes());
        return entity;
    }
}
