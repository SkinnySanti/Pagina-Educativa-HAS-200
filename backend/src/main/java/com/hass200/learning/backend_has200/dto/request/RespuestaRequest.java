package com.hass200.learning.backend_has200.dto.request;

import jakarta.validation.constraints.NotNull;

public record RespuestaRequest(
        @NotNull Long preguntaId,
        Long opcionId  //null = sin responder
) {}
