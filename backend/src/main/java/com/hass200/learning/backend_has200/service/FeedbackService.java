package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.dto.response.*;
import com.hass200.learning.backend_has200.models.Intento;
import com.hass200.learning.backend_has200.models.Opcion;
import com.hass200.learning.backend_has200.models.Pregunta;
import com.hass200.learning.backend_has200.models.RespuestaIntento;
import com.hass200.learning.backend_has200.models.enums.EstadoIntento;
import com.hass200.learning.backend_has200.models.enums.Habilidad;
import com.hass200.learning.backend_has200.models.enums.TipoExamen;
import com.hass200.learning.backend_has200.repository.IntentoRepository;
import com.hass200.learning.backend_has200.repository.IpreguntaRepository;
import com.hass200.learning.backend_has200.repository.RespuestaIntentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.*;

/** Datos de la página de Retroalimentación. Siempre del estudiante autenticado; nunca de otro. */
@Service
public class FeedbackService {

    private final IntentoRepository intentoRepository;
    private final IpreguntaRepository preguntaRepository;
    private final RespuestaIntentoRepository respuestaRepository;
    private final RevisionService revisionService;

    public FeedbackService(IntentoRepository intentoRepository, IpreguntaRepository preguntaRepository,
                           RespuestaIntentoRepository respuestaRepository, RevisionService revisionService) {
        this.intentoRepository = intentoRepository;
        this.preguntaRepository = preguntaRepository;
        this.respuestaRepository = respuestaRepository;
        this.revisionService = revisionService;
    }

    /** GET /api/me/attempts: historial (enviados y vencidos), el más reciente primero. */
    @Transactional(readOnly = true)
    public List<IntentoHistorialDto> historial(Long estudianteId) {
        return intentoRepository.listarCerradosConExamen(estudianteId).stream()
                .map(i -> {
                    boolean enviado = i.getEstado() == EstadoIntento.ENVIADO;
                    Long segundos = enviado && i.getEnviadoEn() != null
                            ? Math.max(0L, Duration.between(i.getIniciadoEn(), i.getEnviadoEn()).getSeconds())
                            : null;
                    return new IntentoHistorialDto(
                            i.getId(), i.getExamen().getModulo(), i.getExamen().getTipo(), i.getEstado(),
                            enviado ? i.getPuntaje() : null,
                            enviado ? i.getAciertos() : null,
                            enviado ? i.getTotal() : null,
                            segundos,
                            i.getEnviadoEn() != null ? i.getEnviadoEn() : i.getIniciadoEn());
                })
                .toList();
    }

    /** GET /api/me/feedback: por módulo, diagnóstica vs. post (con habilidades) y los errores a repasar. */
    @Transactional(readOnly = true)
    public FeedbackDto feedback(Long estudianteId) {
        // Ya vienen del más reciente al más antiguo: el primero de cada tipo/módulo es el último intento.
        List<Intento> enviados = intentoRepository.listarCerradosConExamen(estudianteId).stream()
                .filter(i -> i.getEstado() == EstadoIntento.ENVIADO)
                .toList();

        SortedSet<Integer> modulos = new TreeSet<>();
        enviados.forEach(i -> modulos.add(i.getExamen().getModulo()));

        List<ModuloFeedbackDto> resultado = new ArrayList<>();
        for (Integer modulo : modulos) {
            Intento diag = ultimo(enviados, modulo, TipoExamen.DIAGNOSTICO);
            Intento post = ultimo(enviados, modulo, TipoExamen.POST_RECORRIDO);
            Intento base = post != null ? post : diag;
            List<ErrorRevisionDto> errores = revisionService.revisar(estudianteId, base.getId()).errores();
            resultado.add(new ModuloFeedbackDto(modulo, resumen(diag), resumen(post), errores));
        }
        return new FeedbackDto(resultado);
    }

    private static Intento ultimo(List<Intento> enviados, int modulo, TipoExamen tipo) {
        return enviados.stream()
                .filter(i -> i.getExamen().getModulo() == modulo && i.getExamen().getTipo() == tipo)
                .findFirst()
                .orElse(null);
    }

    private ResumenIntentoDto resumen(Intento intento) {
        if (intento == null) return null;

        Map<Long, Opcion> marcadas = new HashMap<>();
        for (RespuestaIntento r : respuestaRepository.findByIntentoIdConOpcion(intento.getId())) {
            if (r.getOpcion() != null) marcadas.put(r.getId().getPreguntaId(), r.getOpcion());
        }

        Map<Habilidad, int[]> conteo = new EnumMap<>(Habilidad.class);
        for (Pregunta p : preguntaRepository.findConOpcionesByExamenId(intento.getExamen().getId())) {
            int[] c = conteo.computeIfAbsent(p.getHabilidad(), k -> new int[2]);
            c[1]++;
            Opcion marcada = marcadas.get(p.getId());
            if (marcada != null && marcada.isEsCorrecta()) c[0]++;
        }

        Map<Habilidad, HabilidadResultadoDto> habilidades = new EnumMap<>(Habilidad.class);
        conteo.forEach((h, c) -> habilidades.put(h, new HabilidadResultadoDto(c[0], c[1])));
        return new ResumenIntentoDto(intento.getId(), intento.getPuntaje(), habilidades);
    }
}
