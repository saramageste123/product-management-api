package com.saraprojects.product_api.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(

        @NotBlank(message = "Employee code is required")
        String employeeCode,

        @NotBlank(message = "Password is required")
        String password

) {
}