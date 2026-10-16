package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.repository.ProgresoGuiaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GuiaPolicy  {

    private final ProgresoGuiaRepository progresoGuiaRepository;

    public GuiaPolicy(ProgresoGuiaRepository progresoGuiaRepository){
        this.progresoGuiaRepository = progresoGuiaRepository;
    }

    public static final List<String> MODULOS = List.of("m1", "m2");

    @Value("${app.guias.pasos-por-modulo}")
    private int pasosModulos;

    public int getPasosModulo(){
        return pasosModulos;
    }

    public boolean completa(long pasosHechos){
        return pasosHechos >= pasosModulos;
    }

    public boolean completa(Long estudianteId, int modulo) {
        return completa(progresoGuiaRepository
                .countByIdEstudianteIdAndIdModulo(estudianteId, "m" +  modulo));
    }

}
