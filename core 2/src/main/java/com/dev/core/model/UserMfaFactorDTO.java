package com.dev.core.model;

import java.util.Map;

import com.dev.core.constants.MfaType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserMfaFactorDTO {

    private MfaType type;
    private boolean enabled;
    private boolean verified;

    // Optional fields (used only if MFA type requires them)
    private String phoneNumber;   // For SMS OTP MFA
    private String emailForOtp;   // For Email OTP MFA
    private Map<String, Object> metadata;

}
