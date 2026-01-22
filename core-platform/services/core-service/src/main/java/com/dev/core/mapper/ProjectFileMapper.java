package com.dev.core.mapper;


import com.dev.core.domain.Project;
import com.dev.core.domain.ProjectFile;
import com.dev.core.model.ProjectFileDTO;

import java.util.List;
import java.util.stream.Collectors;

public final class ProjectFileMapper {

    private ProjectFileMapper() {}

    public static ProjectFileDTO toDTO(ProjectFile entity) {
        if (entity == null) return null;

        return ProjectFileDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())

                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .originalFilename(entity.getOriginalFilename())
                .storedPath(entity.getStoredPath())
                .contentType(entity.getContentType())
                .fileSize(entity.getFileSize())
                .visibility(entity.getVisibility())
                .uploadedBy(entity.getUploadedBy())
                .description(entity.getDescription())
                .build();
    }

    public static ProjectFile toEntity(ProjectFileDTO dto, Project project) {
        if (dto == null) return null;

        ProjectFile entity = new ProjectFile();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        entity.setProject(project);
        entity.setOriginalFilename(dto.getOriginalFilename());
        entity.setStoredPath(dto.getStoredPath());
        entity.setContentType(dto.getContentType());
        entity.setFileSize(dto.getFileSize());
        entity.setVisibility(dto.getVisibility());
        entity.setUploadedBy(dto.getUploadedBy());
        entity.setDescription(dto.getDescription());

        return entity;
    }

    public static List<ProjectFileDTO> toDTOList(List<ProjectFile> entities) {
        return entities == null ? List.of() : entities.stream()
                .map(ProjectFileMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static List<ProjectFile> toEntityList(List<ProjectFileDTO> dtos, Project project) {
        return dtos == null ? List.of() : dtos.stream()
                .map(dto -> toEntity(dto, project))
                .collect(Collectors.toList());
    }
}
