package com.hass200.learning.backend_has200.dto.response;

import com.hass200.learning.backend_has200.models.enums.Habilidad;

public record ErrorRevisionDto(
        Long preguntaId,
        int posicion,
        String idioma,
        String enunciado,
        Habilidad habilidad,
        String concepto,
        OpcionRevisionDto opcionMarcada,   // null = sin responder
        OpcionRevisionDto opcionCorrecta,
        String explicacion,
        String referenciaModulo
) {}
