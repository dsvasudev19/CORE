package com.dev.core.model;

import com.dev.core.domain.Epic;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EpicDTO extends BaseDTO {

    private String key;
    private String name;
    private String description;
    private String color;
    private Epic.EpicStatus status;
    private Long projectId;
    private Set<IssueDTO> issues;
}
