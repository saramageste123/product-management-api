package com.saraprojects.product_api.dto;

public record RegisterResponseDTO(
        String employeeCode,
        String name,
        Integer avatarId,
        String message
) {
}