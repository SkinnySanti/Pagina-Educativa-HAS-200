package com.hass200.learning.backend_has200.dto.response;

import com.hass200.learning.backend_has200.models.enums.EstadoExamen;
import com.hass200.learning.backend_has200.models.enums.TipoExamen;

public record ExamenResumenDto(
        Long id,
        String codigo,
        TipoExamen tipo,
        int modulo,
        int tiempoLimiteMinutos,
        int totalPreguntas,
        int preguntasEnIngles,
        EstadoExamen estado,
        Long intentoEnCursoId
) {}
