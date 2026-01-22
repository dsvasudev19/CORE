package com.dev.core.mapper;


import org.springframework.stereotype.Component;

import com.dev.core.domain.UserMfaFactor;
import com.dev.core.model.UserMfaFactorDTO;

@Component
public class UserMfaFactorMapper {

    public UserMfaFactorDTO toDTO(UserMfaFactor entity) {
        if (entity == null) return null;

        UserMfaFactorDTO dto = new UserMfaFactorDTO();
        dto.setType(entity.getType());
        dto.setEnabled(entity.isEnabled());
        dto.setVerified(entity.isVerified());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setEmailForOtp(entity.getEmailForOtp());
        return dto;
    }

    public void updateEntityFromDTO(UserMfaFactorDTO dto, UserMfaFactor entity) {
        if (dto == null || entity == null) return;

        entity.setType(dto.getType());
        entity.setEnabled(dto.isEnabled());
        entity.setVerified(dto.isVerified());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setEmailForOtp(dto.getEmailForOtp());
    }
}
