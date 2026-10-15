package com.hass200.learning.backend_has200.dto.response;

import com.hass200.learning.backend_has200.models.enums.EstadoIntento;

import java.time.Instant;

public record ResultadoIntentoDto(
        Long intentoId,
        EstadoIntento estado,
        int aciertos,
        int total,
        int puntaje,
        Instant enviadoEn
) {
}
