package com.dev.core.domain.minimal;


import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MinimalClient {
	private long id;
	

    private String name;

    private String code;
    
}