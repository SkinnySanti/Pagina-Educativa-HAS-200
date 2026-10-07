package com.hass200.learning.backend_has200.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Size(max = 255) String correo,
        @NotBlank @Size(max = 128) String contrasena){}


