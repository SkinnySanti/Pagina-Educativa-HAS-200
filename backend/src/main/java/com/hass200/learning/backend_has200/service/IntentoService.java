package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.dto.request.EnviarIntentoRequest;
import com.hass200.learning.backend_has200.dto.request.RespuestaRequest;
import com.hass200.learning.backend_has200.dto.response.IntentoIniciadoDto;
import com.hass200.learning.backend_has200.dto.response.OpcionDto;
import com.hass200.learning.backend_has200.dto.response.PreguntaDto;
import com.hass200.learning.backend_has200.dto.response.ResultadoIntentoDto;
import com.hass200.learning.backend_has200.exceptions.ReglaNegocioException;
import com.hass200.learning.backend_has200.models.*;
import com.hass200.learning.backend_has200.models.enums.EstadoIntento;
import com.hass200.learning.backend_has200.models.enums.TipoExamen;
import com.hass200.learning.backend_has200.repository.IEstudianteRepository;
import com.hass200.learning.backend_has200.repository.IExamenRepository;
import com.hass200.learning.backend_has200.repository.IntentoRepository;
import com.hass200.learning.backend_has200.repository.IpreguntaRepository;
import jakarta.persistence.EntityManager;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.task.ThreadPoolTaskExecutorBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Log4j2
public class IntentoService {
    private final IEstudianteRepository estudianteRepository;
    private final IntentoRepository intentoRepository;
    private final IpreguntaRepository preguntaRepository;
    private final Clock reloj;
    private final GuiaPolicy guiaPolicy;
    private final IExamenRepository examenRepository;
    private final EntityManager entityManager;
    private final ThreadPoolTaskExecutorBuilder threadPoolTaskExecutorBuilder;

    public IntentoService(IEstudianteRepository estudianteRepository, IntentoRepository intentoRepository,
                          IpreguntaRepository preguntaRepository, Clock clock, GuiaPolicy guiaPolicy,
                          IExamenRepository examenRepository, EntityManager entityManager, ThreadPoolTaskExecutorBuilder threadPoolTaskExecutorBuilder) {
        this.intentoRepository = intentoRepository;
        this.estudianteRepository = estudianteRepository;
        this.preguntaRepository = preguntaRepository;
        this.reloj = clock;
        this.guiaPolicy = guiaPolicy;
        this.examenRepository = examenRepository;
        this.entityManager = entityManager;
        this.threadPoolTaskExecutorBuilder = threadPoolTaskExecutorBuilder;
    }

    @Transactional
    public IntentoIniciadoDto iniciarOReanudar(Long estudianteId, Long examenId){
        Examen examen = examenRepository.findById(examenId).
                orElseThrow(()-> ReglaNegocioException.noEncontrado("Examen no encontrado",
                        "EXAMEN_NO_ENCONTRADO"));

        Instant ahora = Instant.now(reloj);

        if (examen.getTipo() == TipoExamen.DIAGNOSTICO
                && intentoRepository.existsByEstudianteIdAndExamenIdAndEstado(
                estudianteId, examenId, EstadoIntento.ENVIADO)) {
            throw ReglaNegocioException.conflicto(
                     "La evaluación diagnóstica ya fue presentada", "DIAGNOSTICO_USADO");
        }

        Optional<Intento> vigente = intentoRepository
                .findFirstByEstudianteIdAndExamenIdAndEstadoAndVenceEnAfterOrderByIniciadoEnDesc(
                        estudianteId, examenId, EstadoIntento.EN_CURSO, ahora);

        //Reanudar intento existente
        if(vigente.isPresent()){
            return armar(vigente.get(), examen, true);
        }

        if(examen.getTipo() == TipoExamen.POST_RECORRIDO && !guiaPolicy.completa(estudianteId, examen.getModulo())){
            throw ReglaNegocioException.prohibido("Debes completar la guía del módulo antes de presentar este examen",
                    "GUIA_INCOMPLETA");
        }
        Intento nuevo = intentoRepository.save(
                Intento.iniciar(estudianteRepository.getReferenceById(estudianteId),
                        examen, ahora));{
            return armar(nuevo, examen, false);
        }
    }

    private IntentoIniciadoDto armar(Intento intento, Examen examen, boolean reanudado){
        List<PreguntaDto> preguntas = preguntaRepository.findConOpcionesByExamenId(examen.getId()).stream()
                .map(pregunta -> new PreguntaDto(
                      pregunta.getId(),
                      pregunta.getPosicion(),
                      pregunta.getEnunciado(),
                      pregunta.getIdioma().toLowerCase(Locale.ROOT),
                        pregunta.getOpciones().stream()
                                .map(opcion -> new OpcionDto(
                                        opcion.getId(),
                                        opcion.getPosicion(),
                                        opcion.getTexto()
                                )).toList()))
                .toList();

        return new IntentoIniciadoDto(
                intento.getId(),
                examen.getId(),
                examen.getTipo(),
                examen.getModulo(),
                intento.getIniciadoEn(),
                intento.getVenceEn(),
                reanudado,
                preguntas
        );
    }

    @Value("${app.intentos.segundos-gracia}")
    private int segundosGracia;

    @Transactional(noRollbackFor = ReglaNegocioException.class)
    public ResultadoIntentoDto enviar(Long estudianteId, Long intentoId, EnviarIntentoRequest request){
        Instant ahora = Instant.now(reloj);

        Intento intento = intentoRepository.bloquearPorIdYEstudiante(intentoId, estudianteId)
                .orElseThrow(()-> ReglaNegocioException.noEncontrado(
                     "Intento no encontrado", "INTENTO_NO_ENCONTRADO"
                ));

        if(intento.getEstado() == EstadoIntento.ENVIADO){
            throw ReglaNegocioException.conflicto(
                "Este intento ya fue enviado", "INTENTO_YA_ENVIADO");
        }

        if(intento.getEstado() == EstadoIntento.VENCIDO){
            throw ReglaNegocioException.conflicto(
                    "El tiempo de este intento terminó", "INTENTO_YA_VENCIDO");
        }

        if(ahora.isAfter(intento.getVenceEn().plusSeconds(segundosGracia))){
            intento.marcarVencido(ahora);
            throw ReglaNegocioException.conflicto(
              "El tiempo del examen terminó; este intento no cuenta","INTENTO_VENCIDO");
        }

        Examen examen = intento.getExamen();
        boolean esDiagnostico = examen.getTipo() == TipoExamen.DIAGNOSTICO;

        if(esDiagnostico && intentoRepository.existsByEstudianteIdAndExamenIdAndEstado(
                estudianteId, examen.getId(), EstadoIntento.ENVIADO)){
            throw ReglaNegocioException.conflicto(
                    "La evaluación diagnóstica ya fue presentada", "DIAGNOSTICO_USADO");
        }

        List<Pregunta> preguntas = preguntaRepository.findConOpcionesByExamenId(examen.getId());
        if(preguntas.isEmpty()){
            throw new IllegalStateException("El examen " + examen.getId() + " no tiene preguntas");
        }

        Map<Long, Opcion> elegidas = validarRespuestas(preguntas, request);

        int aciertos = 0;
        for(Pregunta pregunta : preguntas){
            Opcion marcada = elegidas.get(pregunta.getId());
            if(marcada != null && marcada.isEsCorrecta()){
                aciertos++;
            }
            entityManager.persist(RespuestaIntento.de(intento, pregunta, marcada));
        }

        int total = preguntas.size();
        int puntaje = (int) Math.round(aciertos * 100.0 / total);
        String clave = esDiagnostico ? estudianteId + ":" + examen.getId() : null;

        intento.marcarEnviado(ahora, aciertos, total, puntaje, clave);

        return new ResultadoIntentoDto(
                intento.getId(),intento.getEstado(), aciertos, total, puntaje, intento.getEnviadoEn());
    }

    private Map<Long, Opcion> validarRespuestas(List<Pregunta> preguntas, EnviarIntentoRequest request){
        Map<Long, Pregunta> porId = preguntas.stream()
                .collect(Collectors.toMap(Pregunta::getId, Function.identity()));
        Set<Long> vistas = new HashSet<>();
        Map<Long, Opcion> elegidas = new HashMap<>();

        for(RespuestaRequest r : request.respuestas()){
            Pregunta pregunta = porId.get(r.preguntaId());
            if(pregunta == null){
                throw ReglaNegocioException.invalido(
                        "La pregunta " + r.preguntaId() + " no pertenece a este examen", "PREGUNTA_INVALIDA");
            }
            if(!vistas.add(r.preguntaId())){
                throw ReglaNegocioException.invalido(
                        "La pregunta " + r.preguntaId() + " viene repetida", "RESPUESTA_DUPLICADA");
            }
            if(r.opcionId() != null){
                Opcion opcion = pregunta.getOpciones().stream()
                        .filter(x -> x.getId().equals(r.opcionId()))
                        .findFirst().
                        orElseThrow(()-> ReglaNegocioException.invalido(
                                "La opción " + r.opcionId() + " no pertenece a la pregunta" + pregunta.getId(), "OPCION_INVALIDA"));
                elegidas.put(pregunta.getId(), opcion);
            }
        }
        return  elegidas;
    }
}
