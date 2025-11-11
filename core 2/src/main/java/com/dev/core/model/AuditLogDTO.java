package com.dev.core.model;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
public class AuditLogDTO extends BaseDTO {
    private Long userId;
    private String action;
    private String entityName;
    private Long entityId;
    private String metadata;
}
