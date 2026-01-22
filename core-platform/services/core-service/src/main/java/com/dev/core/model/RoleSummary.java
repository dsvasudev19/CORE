package com.dev.core.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleSummary {
    private Long id;
    private String name;
    private String description;
}
