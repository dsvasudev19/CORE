package com.dev.core.model.bug;

import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BugHistoryDTO extends BaseDTO {

    private Long bugId;
    private String changedField;
    private String oldValue;
    private String newValue;
    private Long changedBy;
    private LocalDateTime changedAt;
    private String note;
}
