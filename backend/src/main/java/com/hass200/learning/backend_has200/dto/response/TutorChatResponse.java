package com.hass200.learning.backend_has200.dto.response;

/** Respuesta del tutor + cuántas preguntas le quedan hoy al estudiante. */
public record TutorChatResponse(String respuesta, int restantesHoy) {}
