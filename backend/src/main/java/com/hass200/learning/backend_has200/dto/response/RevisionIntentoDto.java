package com.hass200.learning.backend_has200.dto.response;

import java.util.List;

public record RevisionIntentoDto(
        Long intentoId,
        int puntaje,
        int aciertos,
        int total,
        List<ErrorRevisionDto> errores
) {
}
