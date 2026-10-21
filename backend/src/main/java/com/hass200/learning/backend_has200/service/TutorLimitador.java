package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.config.TutorProperties;
import com.hass200.learning.backend_has200.exceptions.ReglaNegocioException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

/**
 * Límites de uso del tutor, en memoria (ventanas móviles). Protegen la cuota gratuita de Groq,
 * que se comparte entre TODOS los estudiantes (los límites de Groq son por organización).
 * Con más de una instancia del backend cada una llevaría su propia cuenta: para el plan gratuito
 * (una sola instancia) es suficiente.
 */
@Component
public class TutorLimitador {

    private static final Duration MINUTO = Duration.ofMinutes(1);
    private static final Duration DIA = Duration.ofHours(24);

    private final TutorProperties props;
    private final Clock clock;

    private final Map<Long, Deque<Instant>> porEstudiante = new HashMap<>();
    private final Deque<Instant> global = new ArrayDeque<>();

    public TutorLimitador(TutorProperties props, Clock clock) {
        this.props = props;
        this.clock = clock;
    }

    /** Reserva un uso. Devuelve cuántas preguntas le quedan hoy al estudiante o lanza 429. */
    public synchronized int consumir(long estudianteId) {
        Instant ahora = clock.instant();
        podar(global, ahora.minus(DIA));
        if (porEstudiante.size() > 5_000) limpiarInactivos(ahora);
        Deque<Instant> usos = porEstudiante.computeIfAbsent(estudianteId, k -> new ArrayDeque<>());
        podar(usos, ahora.minus(DIA));

        if (usos.size() >= props.limitePorDia()) {
            throw new ReglaNegocioException(
                    "Llegaste al límite de preguntas de hoy. Vuelve mañana.",
                    HttpStatus.TOO_MANY_REQUESTS, "TUTOR_LIMITE_USUARIO");
        }
        if (contarDesde(usos, ahora.minus(MINUTO)) >= props.limitePorMinuto()) {
            throw new ReglaNegocioException(
                    "Vas muy rápido. Espera un momento antes de preguntar de nuevo.",
                    HttpStatus.TOO_MANY_REQUESTS, "TUTOR_LIMITE_RITMO");
        }
        if (global.size() >= props.limiteGlobalPorDia()
                || contarDesde(global, ahora.minus(MINUTO)) >= props.limiteGlobalPorMinuto()) {
            throw new ReglaNegocioException(
                    "El tutor está muy solicitado en este momento. Inténtalo de nuevo en un rato.",
                    HttpStatus.TOO_MANY_REQUESTS, "TUTOR_LIMITE_GLOBAL");
        }

        usos.addLast(ahora);
        global.addLast(ahora);
        return Math.max(props.limitePorDia() - usos.size(), 0);
    }

    /** Si Groq falló por culpa nuestra o del proveedor, el estudiante no pierde la pregunta. */
    public synchronized void devolver(long estudianteId) {
        Deque<Instant> usos = porEstudiante.get(estudianteId);
        if (usos != null) usos.pollLast();
        global.pollLast();
    }

    private static void podar(Deque<Instant> usos, Instant limite) {
        while (!usos.isEmpty() && usos.peekFirst().isBefore(limite)) usos.pollFirst();
    }

    private static int contarDesde(Deque<Instant> usos, Instant desde) {
        int n = 0;
        for (Instant i : usos) if (!i.isBefore(desde)) n++;
        return n;
    }

    private void limpiarInactivos(Instant ahora) {
        Instant limite = ahora.minus(DIA);
        porEstudiante.values().removeIf(d -> d.isEmpty() || d.peekLast().isBefore(limite));
    }
}
