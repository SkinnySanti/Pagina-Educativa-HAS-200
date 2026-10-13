package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.dto.response.ExamenResumenDto;
import com.hass200.learning.backend_has200.models.enums.EstadoExamen;
import com.hass200.learning.backend_has200.models.enums.TipoExamen;
import com.hass200.learning.backend_has200.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class ExamenService {

    private final Clock reloj;
    private final IntentoRepository intentoRepository;
    private final ProgresoGuiaRepository progresoGuiaRepository;
    private final IExamenRepository examenRepository;

    @Value("${app.guias.pasos-por-modulo:6}")
    private int pasosPorModulo;

    @Transactional(readOnly = true)
    public List<ExamenResumenDto> listar(Long estudianteId){
        Instant ahora = Instant.now(reloj);

        Map<Long, Long> enCurso = intentoRepository.listarEnCursoVigentes(estudianteId, ahora).stream()
                .collect(Collectors.toMap(
                        IntentoEnCursoResumen::getExamenId,
                        IntentoEnCursoResumen::getIntentoId,
                        Long::max
                ));
        Set<Long> enviados = new HashSet<>(
                intentoRepository.listarExamenIdsEnviados(estudianteId)
        );

        Map<String, Long> pasosCompletados = progresoGuiaRepository.findByIdEstudianteId(estudianteId).stream()
                .collect(Collectors.groupingBy(
                        paso -> paso.getId().getModulo(), Collectors.counting()
                ));

        return examenRepository.listarResumenes().stream()
                .map(e -> {
                    Long intentoEnCursoId = enCurso.get(e.getId());
                    EstadoExamen estado = calcularEstado(e, intentoEnCursoId != null,
                            enviados, pasosCompletados);
                    return new ExamenResumenDto(
                            e.getId(), e.getCodigo(), e.getTipo(), e.getModulo(),
                            e.getTiempoLimiteMinutos(),
                            e.getTotalPreguntas().intValue(),
                            e.getPreguntasEnIngles().intValue(),
                            estado, intentoEnCursoId
                    );
                })
                .toList();
        }

    private EstadoExamen calcularEstado(ResumenExamen e, boolean tieneEnCurso,
                                        Set<Long> enviados,
                                        Map<String, Long> pasosCompletados) {
        if (e.getTipo() == TipoExamen.DIAGNOSTICO) {
            return enviados.contains(e.getId())
                    ? EstadoExamen.USADO
                    : EstadoExamen.DISPONIBLE;
        }
        if (tieneEnCurso) {
            return EstadoExamen.DISPONIBLE;
        }
        long hechos = pasosCompletados.getOrDefault("m" + e.getModulo(), 0L);
        return hechos >= pasosPorModulo
                ? EstadoExamen.DISPONIBLE
                : EstadoExamen.BLOQUEADO_GUIA;
    }

}
