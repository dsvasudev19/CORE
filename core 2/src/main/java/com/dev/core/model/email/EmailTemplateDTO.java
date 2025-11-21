

package com.dev.core.model.email;

import com.dev.core.model.BaseDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailTemplateDTO extends BaseDTO {

    @NotBlank(message = "Template code is required")
    private String code;

    @NotBlank(message = "Template name is required")
    private String name;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Template HTML cannot be empty")
    private String templateHtml;

    private String description;
}
