package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.dto.response.ErrorRevisionDto;
import com.hass200.learning.backend_has200.dto.response.OpcionRevisionDto;
import com.hass200.learning.backend_has200.dto.response.RevisionIntentoDto;
import com.hass200.learning.backend_has200.exceptions.ReglaNegocioException;
import com.hass200.learning.backend_has200.models.Intento;
import com.hass200.learning.backend_has200.models.Opcion;
import com.hass200.learning.backend_has200.models.RespuestaIntento;
import com.hass200.learning.backend_has200.models.enums.EstadoIntento;
import com.hass200.learning.backend_has200.repository.IntentoRepository;
import com.hass200.learning.backend_has200.repository.IpreguntaRepository;
import com.hass200.learning.backend_has200.repository.RespuestaIntentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class RevisionService {

    private final IntentoRepository intentoRepository;
    private final IpreguntaRepository preguntaRepository;
    private final RespuestaIntentoRepository respuestaRepository;

    public RevisionService(IntentoRepository intentoRepository, IpreguntaRepository preguntaRepository,
                           RespuestaIntentoRepository respuestaRepository) {
        this.intentoRepository = intentoRepository;
        this.preguntaRepository = preguntaRepository;
        this.respuestaRepository = respuestaRepository;
    }

    @Transactional(readOnly = true)
    public RevisionIntentoDto revisar(Long estudianteId, Long intentoId){
        Intento intento = intentoRepository.findByIdAndEstudianteId(intentoId, estudianteId)
                .orElseThrow(()-> ReglaNegocioException.noEncontrado(
                        "Intento no encontrado", "INTENTO_NO_ENCONTRADO"));

        if(intento.getEstado() != EstadoIntento.ENVIADO){
            String mensaje = intento.getEstado() == EstadoIntento.EN_CURSO
                    ? "El intento aún no se ha enviado; la revisión estará disponible al enviarlo"
                    : "Este intento venció y no tiene revisión";
            throw ReglaNegocioException.conflicto(mensaje, "INTENTO_NO_ENVIADO");
        }

        Map<Long, Opcion> marcadas = new HashMap<>();
        for(RespuestaIntento respuesta : respuestaRepository.findByIntentoIdConOpcion(intentoId)){
            if(respuesta.getOpcion() != null){
                marcadas.put(respuesta.getId().getPreguntaId(), respuesta.getOpcion());
            }
        }

        List<ErrorRevisionDto> errores = preguntaRepository.
                findConOpcionesByExamenId(intento.getExamen().getId()).stream()
                .map(pregunta -> {
                    Opcion marcada = marcadas.get(pregunta.getId());
                    if(marcada != null && marcada.isEsCorrecta()){
                        return null;
                    }
                    Opcion correcta = pregunta.getOpciones().stream()
                            .filter(Opcion::isEsCorrecta)
                            .findFirst()
                            .orElseThrow(()->new IllegalStateException(
                                    "La pregunta " + pregunta.getId() + " no tiene opción correcta"));
                    return new ErrorRevisionDto(
                            pregunta.getId(), pregunta.getPosicion(),
                            pregunta.getIdioma().toLowerCase(Locale.ROOT),
                            pregunta.getEnunciado(), pregunta.getHabilidad(), pregunta.getConcepto(),
                            marcada == null ? null
                                            : new OpcionRevisionDto(marcada.getId(), marcada.getTexto()),
                            new OpcionRevisionDto(correcta.getId(), correcta.getTexto()),
                            pregunta.getExplicacion(), pregunta.getReferenciaModulo()
                    );
                })
                .filter(Objects::nonNull)
                .toList();

        return new RevisionIntentoDto(
                intento.getId(), intento.getPuntaje(),
                intento.getAciertos(), intento.getTotal(),
                errores);
    }
}
