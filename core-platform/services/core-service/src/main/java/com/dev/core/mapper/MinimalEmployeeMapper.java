package com.dev.core.mapper;


import com.dev.core.domain.Employee;
import com.dev.core.model.MinimalEmployeeDTO;

public class MinimalEmployeeMapper {

    private MinimalEmployeeMapper() {}

    public static MinimalEmployeeDTO toMinimalDTO(Employee entity) {
        if (entity == null) return null;

        return MinimalEmployeeDTO.builder()
                .id(entity.getId())
                .employeeCode(entity.getEmployeeCode())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .build();
    }
}
