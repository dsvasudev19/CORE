package com.dev.core.model.leave;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MinimalLeaveBalanceDTO {

    private Long leaveTypeId;
    private String leaveTypeName;

    private Integer openingBalance;
    private Integer earned;
    private Integer used;
    private Integer closingBalance;
}
