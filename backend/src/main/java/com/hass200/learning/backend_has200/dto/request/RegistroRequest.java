package com.hass200.learning.backend_has200.dto.request;

import jakarta.validation.constraints.*;

public record RegistroRequest(
        @NotBlank @Email @Size(max = 255) String correo,
        @NotBlank @Pattern(regexp = "^[A-Za-z0-9_]{3,20}$",
                message = "El alias debe tener de 3 a 20 caracteres: letras, números o guion bajo") //Prevención de ataques
        String alias,
        @NotBlank @Size(min = 8, max = 64) String contrasena,
        @AssertTrue(message = "Debes aceptar la política de tratamiento de datos")
        boolean politicaAceptada
) {}

