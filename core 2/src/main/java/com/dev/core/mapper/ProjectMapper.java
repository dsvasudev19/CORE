package com.dev.core.mapper;

import com.dev.core.domain.Client;
import com.dev.core.domain.Project;
import com.dev.core.domain.minimal.MinimalClient;
import com.dev.core.domain.minimal.MinimalProjectPhase;
import com.dev.core.model.ProjectDTO;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public final class ProjectMapper {

    private ProjectMapper() {}

    // =======================
    // Full DTO Conversion
    // =======================
    public static ProjectDTO toDTO(Project entity) {
        if (entity == null) return null;

        return ProjectDTO.builder()
                // BaseDTO fields
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .createdBy(entity.getCreatedBy())
                .updatedBy(entity.getUpdatedBy())
                .active(entity.getActive())
                .priority(entity.getProjectPriority())

                // Basic fields
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .projectType(entity.getProjectType())

                .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
                .client(
                	    entity.getClient() != null
                	        ? MinimalClient.builder()
                	                .id(entity.getClient().getId())
                	                .name(entity.getClient().getName())
                	                .code(entity.getClient().getCode())
                	                .build()
                	        : null
                	)

                // Dates
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .expectedDeliveryDate(entity.getExpectedDeliveryDate())
                .actualDeliveryDate(entity.getActualDeliveryDate())

                // Progress
                .progressPercentage(entity.getProgressPercentage())

                // New metadata fields
                .budget(entity.getBudget())
                .spent(entity.getSpent())
                .color(entity.getColor())
                .isStarred(entity.getIsStarred())
                .lastActivity(entity.getLastActivity())
                .tags(entity.getTags())

                // Members mapping
                .members(
                        entity.getMembers() != null
                                ? entity.getMembers().stream()
                                         .map(ProjectMemberMapper::toDTO)
                                         .collect(Collectors.toList())
                                : List.of()
                )

                // (Optional) phases & files if your DTO contains them
//                .phases(ProjectPhaseMapper.toDTOList(entity.getPhases()))
                .phases(
                	    entity.getPhases() != null
                	            ? entity.getPhases().stream()
                	                    .map(p -> MinimalProjectPhase.builder()
                	                           .projectId(p.getProject().getId())
                	                            .name(p.getName())
                	                            .description(p.getDescription())
                	                            .status(p.getStatus())
                	                            .startDate(p.getStartDate())
                	                            .endDate(p.getEndDate())
                	                            .progressPercentage(p.getProgressPercentage())
                	                            .orderIndex(p.getOrderIndex())
                	                            .build()
                	                    )
                	                    .collect(Collectors.toList())
                	            : List.of()
                	)


                .files(ProjectFileMapper.toDTOList(entity.getFiles()))

                .build();
    }

    // =======================
    // SHALLOW DTO Conversion
    // For List Views / Dropdowns
    // =======================
    public static ProjectDTO toShallowDTO(Project entity) {
        if (entity == null) return null;

        return ProjectDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .status(entity.getStatus())
                .projectType(entity.getProjectType())
                .clientId(entity.getClient() != null ? entity.getClient().getId() : null)
                .progressPercentage(entity.getProgressPercentage())
                .color(entity.getColor())
                .priority(entity.getProjectPriority())
                .isStarred(entity.getIsStarred())
                .lastActivity(entity.getLastActivity())
                .client(
                	    MinimalClient.builder()
                	        .name(entity.getClient() != null ? entity.getClient().getName() : "")
                	        .code(entity.getClient() != null ? entity.getClient().getCode() : "")
                	        .build()
                	)

                .build();
    }

    // =======================
    // Entity Conversion (DTO → Entity)
    // =======================
    public static Project toEntity(ProjectDTO dto) {
        if (dto == null) return null;

        Project entity = new Project();

        // Base entity fields
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setUpdatedBy(dto.getUpdatedBy());
        entity.setActive(dto.getActive());

        // Basic fields
        entity.setName(dto.getName());
        entity.setCode(dto.getCode());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
        entity.setProjectType(dto.getProjectType());
        entity.setProjectPriority(dto.getPriority());

        // Client association (proxy)
        if (dto.getClientId() != null) {
            Client client = new Client();
            client.setId(dto.getClientId());
            entity.setClient(client);
        } else {
            entity.setClient(null);
        }

        // Dates
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setExpectedDeliveryDate(dto.getExpectedDeliveryDate());
        entity.setActualDeliveryDate(dto.getActualDeliveryDate());

        // Progress
        entity.setProgressPercentage(dto.getProgressPercentage());

        // New metadata
        entity.setBudget(dto.getBudget());
        entity.setSpent(dto.getSpent());
        entity.setColor(dto.getColor());
        entity.setIsStarred(dto.getIsStarred());
        entity.setLastActivity(dto.getLastActivity());
        entity.setTags(dto.getTags());

        // DO NOT map members here  
        // Members must be added in service layer via ProjectMemberService

        return entity;
    }

    // =======================
    // LIST MAPPERS
    // =======================
    public static List<ProjectDTO> toDTOList(List<Project> entities) {
    	log.info("Retrieved projects ",entities);
        return entities == null ? List.of() :
                entities.stream().map(ProjectMapper::toDTO).collect(Collectors.toList());
    }

    public static List<ProjectDTO> toShallowDTOList(List<Project> entities) {
        return entities == null ? List.of() :
                entities.stream().map(ProjectMapper::toShallowDTO).collect(Collectors.toList());
    }

    public static List<Project> toEntityList(List<ProjectDTO> dtos) {
        return dtos == null ? List.of() :
                dtos.stream().map(ProjectMapper::toEntity).collect(Collectors.toList());
    }
}
