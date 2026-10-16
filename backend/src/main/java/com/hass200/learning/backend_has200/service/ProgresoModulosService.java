package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.dto.request.MarcarPasosRequest;
import com.hass200.learning.backend_has200.exceptions.ReglaNegocioException;
import com.hass200.learning.backend_has200.repository.ProgresoGuiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.*;

@Service
public class ProgresoModulosService {
    private final GuiaPolicy guiaPolicy;
    private final Clock reloj;
    private final ProgresoGuiaRepository progresoGuiaRepository;

    public ProgresoModulosService(GuiaPolicy guiaPolicy, Clock clock, ProgresoGuiaRepository progresoGuiaRepository) {
        this.reloj = clock;
        this.guiaPolicy = guiaPolicy;
        this.progresoGuiaRepository = progresoGuiaRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, List<Integer>> obtener(Long estudianteId){
        return armar(estudianteId);
    }

    @Transactional
    public Map<String, List<Integer>> marcarPaso(Long estudianteId, MarcarPasosRequest request){
        if(request.paso() >= guiaPolicy.getPasosModulo()){
            throw ReglaNegocioException.invalido(
                    "El paso debe estar entre 0 y " + (guiaPolicy.getPasosModulo() - 1),
                    "PASO_INVALIDO");
        }
        Instant ahora = Instant.now(reloj);
        progresoGuiaRepository.marcarPaso(estudianteId, request.modulo(), request.paso(), ahora);
        return armar(estudianteId);
    }

    @Transactional
    public Map<String, List<Integer>> reiniciar(Long estudianteId, String modulo){
        if(!GuiaPolicy.MODULOS.contains(modulo)){
            throw ReglaNegocioException.invalido(
                    "El módulo debe ser m1 o m2", "MODULO_INVALIDO");
        }
        progresoGuiaRepository.borrarModulo(estudianteId, modulo);
        return armar(estudianteId);
    }

    private Map<String,List<Integer>> armar(Long estudianteId){
        Map<String, List<Integer>> resultado = new LinkedHashMap<>();
        GuiaPolicy.MODULOS.forEach(m -> resultado.put(m, new ArrayList<>()));

        progresoGuiaRepository.findByIdEstudianteId(estudianteId).forEach(progreso ->
                resultado.computeIfAbsent(progreso.getId().getModulo(), k -> new ArrayList<>())
                        .add(progreso.getId().getPaso()));

        resultado.values().forEach(Collections::sort);

        return resultado;
    }
}
