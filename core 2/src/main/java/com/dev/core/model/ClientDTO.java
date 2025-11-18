package com.dev.core.model;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
public class ClientDTO extends BaseDTO {
    private String name;
    private String code;
    private String domain;
    private String address;
    private String country;
    private String industry;
    private String status;
    private String description;
    
    // Nested collections — allowed because they belong to other entities
    private List<ClientDocumentDTO> documents = new ArrayList<>();
    private List<ClientRepresentativeDTO> representatives = new ArrayList<>();
    
}