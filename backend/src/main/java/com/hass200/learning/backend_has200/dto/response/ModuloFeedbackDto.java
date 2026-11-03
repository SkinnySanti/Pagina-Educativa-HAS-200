package com.hass200.learning.backend_has200.dto.response;

import java.util.List;

/**
 * Retroalimentación de un módulo. diagnostico / post = último intento ENVIADO de cada tipo (o null si aún no hay).
 * errores = los del intento post más reciente; si todavía no hay post, los de la diagnóstica.
 */
public record ModuloFeedbackDto(
        int modulo,
        ResumenIntentoDto diagnostico,
        ResumenIntentoDto post,
        List<ErrorRevisionDto> errores
) {}
