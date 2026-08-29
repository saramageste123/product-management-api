package com.saraprojects.product_api.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequestDTO(
        @NotBlank(message = "Refresh token is required")
        String refreshToken
) {
}