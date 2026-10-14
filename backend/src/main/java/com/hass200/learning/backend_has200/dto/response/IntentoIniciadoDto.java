package com.hass200.learning.backend_has200.dto.response;

import com.hass200.learning.backend_has200.models.enums.TipoExamen;

import java.time.Instant;
import java.util.List;

public record IntentoIniciadoDto(
        Long intentoId,
        Long examenId,
        TipoExamen tipo,
        int modulo,
        Instant iniciadoEn,
        Instant venceEn,
        boolean reanudado,
        List<PreguntaDto> preguntas
) {
}
