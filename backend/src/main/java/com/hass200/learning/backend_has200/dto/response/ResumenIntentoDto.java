package com.hass200.learning.backend_has200.dto.response;

import com.hass200.learning.backend_has200.models.enums.Habilidad;

import java.util.Map;

/** Resultado de un intento enviado: puntaje total y aciertos por habilidad. */
public record ResumenIntentoDto(
        Long intentoId,
        int puntaje,
        Map<Habilidad, HabilidadResultadoDto> habilidades
) {}
