package com.dev.core.domain.minimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MinimalProject {
	private Long id;
	private String name;

	private String code;

}
