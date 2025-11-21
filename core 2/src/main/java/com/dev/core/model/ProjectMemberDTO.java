package com.dev.core.model;

import java.time.LocalDateTime;

import com.dev.core.constants.ProjectRole;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ProjectMemberDTO extends BaseDTO {

    private Long projectId;
    private Long userId;
    private String userName;
    private ProjectRole role;

    private Double hourlyRate;
    private Boolean activeMember;

    private LocalDateTime joinedAt;
    private LocalDateTime lastActivity;
}
