package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.dto.response.IntentoIniciadoDto;
import com.hass200.learning.backend_has200.dto.response.OpcionDto;
import com.hass200.learning.backend_has200.dto.response.PreguntaDto;
import com.hass200.learning.backend_has200.exceptions.ReglaNegocioException;
import com.hass200.learning.backend_has200.models.Examen;
import com.hass200.learning.backend_has200.models.Intento;
import com.hass200.learning.backend_has200.models.enums.EstadoIntento;
import com.hass200.learning.backend_has200.models.enums.TipoExamen;
import com.hass200.learning.backend_has200.repository.IEstudianteRepository;
import com.hass200.learning.backend_has200.repository.IExamenRepository;
import com.hass200.learning.backend_has200.repository.IntentoRepository;
import com.hass200.learning.backend_has200.repository.IpreguntaRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@Log4j2
public class IntentoService {



    private final IEstudianteRepository estudianteRepository;
    private final IntentoRepository intentoRepository;
    private final IpreguntaRepository preguntaRepository;
    private final Clock reloj;
    private final GuiaPolicy guiaPolicy;
    private final IExamenRepository examenRepository;

    public IntentoService(IEstudianteRepository estudianteRepository, IntentoRepository intentoRepository, IpreguntaRepository preguntaRepository, Clock clock, GuiaPolicy guiaPolicy, IExamenRepository examenRepository) {
        this.intentoRepository = intentoRepository;
        this.estudianteRepository = estudianteRepository;
        this.preguntaRepository = preguntaRepository;
        this.reloj = clock;
        this.guiaPolicy = guiaPolicy;
        this.examenRepository = examenRepository;
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
}
