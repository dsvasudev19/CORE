package com.dev.core.model;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class RefreshTokenDTO extends BaseDTO {
    private Long userId;
    private String token;
    private LocalDateTime expiresAt;
    private Boolean revoked;
    private String ipAddress;
    private String userAgent;
}
