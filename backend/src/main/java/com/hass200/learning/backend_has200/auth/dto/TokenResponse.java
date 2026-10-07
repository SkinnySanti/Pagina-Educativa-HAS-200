package com.hass200.learning.backend_has200.auth.dto;

public record TokenResponse(
        String tipo,
        String tokenAcceso,
        long expiraEnSegundos,
        String tokenRefresco
) {}
