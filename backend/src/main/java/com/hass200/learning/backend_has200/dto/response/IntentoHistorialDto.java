package com.hass200.learning.backend_has200.dto.response;

import com.hass200.learning.backend_has200.models.enums.EstadoIntento;
import com.hass200.learning.backend_has200.models.enums.TipoExamen;

import java.time.Instant;

/** Una fila del historial de intentos (GET /api/me/attempts). Solo ENVIADO o VENCIDO. */
public record IntentoHistorialDto(
        Long id,
        int modulo,
        TipoExamen tipo,
        EstadoIntento estado,
        Integer puntaje,     // null si venció
        Integer aciertos,    // null si venció
        Integer total,       // null si venció
        Long segundos,       // tiempo usado; null si venció
        Instant fecha        // enviadoEn (o iniciadoEn si no hay)
) {}
