package com.hass200.learning.backend_has200.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hass200.learning.backend_has200.config.TutorProperties;
import com.hass200.learning.backend_has200.dto.request.TutorChatRequest;
import com.hass200.learning.backend_has200.dto.response.TutorChatResponse;
import com.hass200.learning.backend_has200.exceptions.ReglaNegocioException;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.ArrayList;
import java.util.List;

/**
 * Tutor Virtual: arma la conversación (instrucciones + conocimiento + historial + pregunta) y la envía a Groq
 * (API compatible con OpenAI). La API key vive solo aquí, en el servidor.
 * No se guarda ninguna conversación ni se registra el texto de las preguntas.
 */
@Log4j2
@Service
public class TutorService {

    private final RestClient groq;
    private final TutorProperties props;
    private final TutorConocimiento conocimiento;
    private final TutorLimitador limitador;

    public TutorService(RestClient tutorRestClient, TutorProperties props,
                        TutorConocimiento conocimiento, TutorLimitador limitador) {
        this.groq = tutorRestClient;
        this.props = props;
        this.conocimiento = conocimiento;
        this.limitador = limitador;
    }

    public TutorChatResponse conversar(long estudianteId, TutorChatRequest req) {
        if (!props.habilitado()) {
            log.warn("Tutor desactivado: falta la variable de entorno GROQ_API_KEY");
            throw new ReglaNegocioException("El tutor virtual no está disponible por ahora.",
                    HttpStatus.SERVICE_UNAVAILABLE, "TUTOR_NO_DISPONIBLE");
        }

        int restantes = limitador.consumir(estudianteId);
        try {
            String respuesta = preguntar(armarMensajes(req));
            return new TutorChatResponse(respuesta, restantes);
        } catch (RuntimeException e) {
            limitador.devolver(estudianteId); // la pregunta fallida no cuenta contra el límite
            throw e;
        }
    }

    private List<Mensaje> armarMensajes(TutorChatRequest req) {
        List<Mensaje> mensajes = new ArrayList<>();
        mensajes.add(new Mensaje("system", conocimiento.sistema(req.idioma())));

        List<TutorChatRequest.Turno> historial = req.historial() == null ? List.of() : req.historial();
        int desde = Math.max(historial.size() - props.maxMensajesHistorial(), 0);
        for (TutorChatRequest.Turno t : historial.subList(desde, historial.size())) {
            mensajes.add(new Mensaje(t.rol(), t.contenido()));
        }
        mensajes.add(new Mensaje("user", req.mensaje().strip()));
        return mensajes;
    }

    /** Prueba los modelos en orden: si uno está saturado (429), caído o ya no existe, pasa al siguiente. */
    private String preguntar(List<Mensaje> mensajes) {
        boolean saturado = false;
        for (String modelo : props.modelos()) {
            try {
                String texto = llamar(modelo, mensajes);
                if (texto != null && !texto.isBlank()) return texto.strip();
                log.warn("Groq devolvió una respuesta vacía con el modelo {}", modelo);
            } catch (RestClientResponseException e) {
                int s = e.getStatusCode().value();
                if (s == 401 || s == 403) {
                    log.error("Groq rechazó la API key (HTTP {}). Revisa GROQ_API_KEY.", s);
                    break; // con otro modelo tampoco funcionará
                }
                if (s == 429) saturado = true;
                log.warn("Groq respondió HTTP {} con el modelo {}", s, modelo);
            } catch (ResourceAccessException e) {
                log.warn("No se pudo conectar con Groq (modelo {}): {}", modelo, e.getMessage());
            }
        }
        if (saturado) {
            throw new ReglaNegocioException("El tutor está muy solicitado en este momento. Inténtalo de nuevo en un minuto.",
                    HttpStatus.TOO_MANY_REQUESTS, "TUTOR_LIMITE_GLOBAL");
        }
        throw new ReglaNegocioException("El tutor no pudo responder ahora. Inténtalo de nuevo en un momento.",
                HttpStatus.SERVICE_UNAVAILABLE, "TUTOR_NO_DISPONIBLE");
    }

    private String llamar(String modelo, List<Mensaje> mensajes) {
        String razonamiento = modelo.startsWith("openai/gpt-oss") && props.razonamiento() != null
                && !props.razonamiento().isBlank() ? props.razonamiento() : null;
        Peticion cuerpo = new Peticion(modelo, mensajes, props.temperatura(), props.maxTokensRespuesta(), razonamiento);

        Respuesta r = groq.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + props.apiKey())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(cuerpo)
                .retrieve()
                .body(Respuesta.class);

        if (r == null || r.choices() == null || r.choices().isEmpty() || r.choices().get(0).message() == null) return null;
        return r.choices().get(0).message().content();
    }

    /* ───────── Formato de la API de Groq (compatible con OpenAI) ───────── */

    public record Mensaje(String role, String content) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Peticion(
            String model,
            List<Mensaje> messages,
            double temperature,
            @JsonProperty("max_completion_tokens") int maxCompletionTokens,
            @JsonProperty("reasoning_effort") String reasoningEffort) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Respuesta(List<Opcion> choices) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Opcion(MensajeRespuesta message) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record MensajeRespuesta(String content) {}
}
