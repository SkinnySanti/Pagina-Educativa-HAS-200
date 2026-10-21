package com.hass200.learning.backend_has200.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Pregunta del estudiante al Tutor Virtual.
 * El historial lo guarda el frontend (en memoria) y se reenvía en cada pregunta: el backend no guarda conversaciones.
 */
public record TutorChatRequest(
        @NotBlank(message = "Escribe tu pregunta")
        @Size(max = 600, message = "La pregunta es demasiado larga (máximo 600 caracteres)")
        String mensaje,

        @Size(max = 20, message = "Historial demasiado largo")
        List<@NotNull @Valid Turno> historial,

        @Pattern(regexp = "^(es|en)$", message = "Idioma no soportado")
        String idioma
) {
    public record Turno(
            @NotBlank @Pattern(regexp = "^(user|assistant)$") String rol,
            @NotBlank @Size(max = 6000) String contenido
    ) {}
}
