package com.dev.core.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MfaFactorSetupResponseDTO {
    private String secret;     // For TOTP setup (show once)
    private String qrCodeUri;  // otpauth:// URL
    private String message;
}
