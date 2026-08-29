package com.saraprojects.product_api.dto;

public record AuthResponseDTO(
        String accessToken,
        String refreshToken,
        String tokenType,
        String employeeCode,
        String name,
        Integer avatarId
) {
}