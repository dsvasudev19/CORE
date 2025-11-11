package com.dev.core.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.dev.core.domain.RefreshToken;
import com.dev.core.model.RefreshTokenDTO;

public class RefreshTokenMapper {

    public static RefreshTokenDTO toDTO(RefreshToken entity) {
        if (entity == null) return null;

        return RefreshTokenDTO.builder()
                .id(entity.getId())
                .organizationId(entity.getOrganizationId())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .token(entity.getToken())
                .expiresAt(entity.getExpiresAt())
                .revoked(entity.getRevoked())
                .ipAddress(entity.getIpAddress())
                .userAgent(entity.getUserAgent())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .active(entity.getActive())
                .build();
    }

    public static RefreshToken toEntity(RefreshTokenDTO dto) {
        if (dto == null) return null;

        RefreshToken entity = new RefreshToken();
        entity.setId(dto.getId());
        entity.setOrganizationId(dto.getOrganizationId());
        entity.setToken(dto.getToken());
        entity.setExpiresAt(dto.getExpiresAt());
        entity.setRevoked(dto.getRevoked());
        entity.setIpAddress(dto.getIpAddress());
        entity.setUserAgent(dto.getUserAgent());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        entity.setActive(dto.getActive());
        return entity;
    }

    public static List<RefreshTokenDTO> toDTOList(List<RefreshToken> entities) {
        return entities == null ? null :
                entities.stream().map(RefreshTokenMapper::toDTO).collect(Collectors.toList());
    }
}
