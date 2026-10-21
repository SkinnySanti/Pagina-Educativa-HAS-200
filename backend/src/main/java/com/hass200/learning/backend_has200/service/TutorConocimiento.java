package com.hass200.learning.backend_has200.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;

/**
 * Carga UNA vez, al arrancar, las instrucciones del tutor y el conocimiento del HAS-200.
 * Para ampliar lo que sabe el tutor se edita src/main/resources/tutor/conocimiento-has200.md (sin tocar Java).
 *
 * El texto se arma siempre igual (primero lo estable): Groq reutiliza en caché ese prefijo y los tokens
 * en caché no cuentan para el límite gratuito.
 */
@Component
public class TutorConocimiento {

    private final String sistemaBase;

    public TutorConocimiento(
            @Value("classpath:tutor/prompt-sistema.md") Resource prompt,
            @Value("classpath:tutor/conocimiento-has200.md") Resource conocimiento) {
        this.sistemaBase = leer(prompt) + "\n\n=== CONOCIMIENTO DEL HAS-200 (única fuente de verdad) ===\n\n" + leer(conocimiento);
    }

    /** Mensaje de sistema completo. El idioma va al final para no romper el prefijo en caché. */
    public String sistema(String idioma) {
        String instruccion = "en".equals(idioma)
                ? "\n\nIdioma de esta conversación: inglés. Responde en inglés sencillo (nivel escolar), manteniendo los mismos términos técnicos."
                : "\n\nIdioma de esta conversación: español.";
        return sistemaBase + instruccion;
    }

    private static String leer(Resource r) {
        try {
            return r.getContentAsString(StandardCharsets.UTF_8).strip();
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo leer " + r.getFilename(), e);
        }
    }
}
