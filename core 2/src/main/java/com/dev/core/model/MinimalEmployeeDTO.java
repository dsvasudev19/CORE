package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MinimalEmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
}
