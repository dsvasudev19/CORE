package com.dev.core.model;


import com.dev.core.constants.ProjectActivityType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectActivityDTO {

    private Long id;

    private Long projectId;
    private ProjectActivityType activityType;
    private Long performedBy;
    private MinimalEmployeeDTO performer;

    private String summary;
    private String description;

    /** 
     * For request: the backend serializes this into metadataJson
     * For response: optional echo-back (not required)
     */
    private Map<String, Object> metadata;

    /**
     * For response: raw stored JSON
     */
    private String metadataJson;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
