package com.dev.core.model.task;

import com.dev.core.model.BaseDTO;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TaskTagDTO extends BaseDTO {

    private String name;
    private String color;
}
