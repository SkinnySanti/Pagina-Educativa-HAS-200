package com.hass200.learning.backend_has200.dto.response;

import java.util.List;

public record PreguntaDto(
        Long id,
        int posicion,
        String enunciado,
        String idioma,
        List<OpcionDto> opciones
) {
}
