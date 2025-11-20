package com.dev.core.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAssetDTO extends BaseDTO{
    private Long id;
    private String assetType;
    private Boolean assigned;
}
