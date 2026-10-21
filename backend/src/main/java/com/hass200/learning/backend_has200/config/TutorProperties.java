package com.hass200.learning.backend_has200.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;
import java.util.List;

/**
 * Configuración del Tutor Virtual (prefijo app.tutor en application.yaml).
 * La API key de Groq NUNCA va en el código: llega por la variable de entorno GROQ_API_KEY.
 */
@Validated
@ConfigurationProperties(prefix = "app.tutor")
public record TutorProperties(
        String apiKey,                          // vacía = tutor desactivado (la app arranca igual)
        @NotBlank String baseUrl,               // https://api.groq.com/openai/v1
        @NotEmpty List<@NotBlank String> modelos, // en orden de preferencia; si uno falla se prueba el siguiente
        String razonamiento,                    // low | medium | high (solo modelos openai/gpt-oss-*); vacío = no enviar
        double temperatura,
        @Positive int maxTokensRespuesta,
        @Positive int maxMensajesHistorial,     // cuántos mensajes previos del chat se reenvían al modelo
        @Positive int limitePorMinuto,          // por estudiante
        @Positive int limitePorDia,             // por estudiante (ventana móvil de 24 h)
        @Positive int limiteGlobalPorMinuto,    // todo el sitio (protege el límite gratuito de Groq)
        @Positive int limiteGlobalPorDia,       // todo el sitio (ventana móvil de 24 h)
        @NotNull Duration timeout
) {
    public boolean habilitado() {
        return apiKey != null && !apiKey.isBlank();
    }
}
