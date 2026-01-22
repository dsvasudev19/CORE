package com.dev.core.mapper;

import org.springframework.stereotype.Component;

import com.dev.core.domain.UserSecurityPreference;
import com.dev.core.model.UserSecurityPreferenceDTO;

@Component
public class UserSecurityPreferenceMapper {

    public UserSecurityPreferenceDTO toDTO(UserSecurityPreference entity) {
        if (entity == null) return null;

        UserSecurityPreferenceDTO dto = new UserSecurityPreferenceDTO();
        dto.setMfaRequired(entity.isMfaRequired());
        dto.setPreferredMfa(entity.getPreferredMfa());
        dto.setNotifyOnLogin(entity.isNotifyOnLogin());
        dto.setNotifyOnPasswordChange(entity.isNotifyOnPasswordChange());
        return dto;
    }

    public void updateEntityFromDTO(UserSecurityPreferenceDTO dto, UserSecurityPreference entity) {
        if (dto == null || entity == null) return;

        entity.setMfaRequired(dto.isMfaRequired());
        entity.setPreferredMfa(dto.getPreferredMfa());
        entity.setNotifyOnLogin(dto.isNotifyOnLogin());
        entity.setNotifyOnPasswordChange(dto.isNotifyOnPasswordChange());
    }
}
