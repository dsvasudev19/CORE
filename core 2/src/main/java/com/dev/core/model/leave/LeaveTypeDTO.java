package com.dev.core.model.leave;

import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveTypeDTO extends BaseDTO {

    private String name;

    private Integer annualLimit;
    private Integer monthlyLimit;
    private Integer quarterlyLimit;

    private Boolean earnedLeave;
    private Boolean carryForward;
    private Integer maxCarryForward;
}
