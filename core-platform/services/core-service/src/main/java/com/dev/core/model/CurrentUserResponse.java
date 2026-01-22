package com.dev.core.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CurrentUserResponse {
    private Long id;
    private String username;
    private String email;
    private Long organizationId;
    private String status;
    private LocalDateTime lastLoginAt;
    private List<RoleSummary> roles;
    private Set<String> permissions;
}
