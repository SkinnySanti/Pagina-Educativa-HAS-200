package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.dto.request.RegistroRequest;
import com.hass200.learning.backend_has200.dto.response.EstudianteResponse;
import com.hass200.learning.backend_has200.exceptions.ConflictoException;
import com.hass200.learning.backend_has200.models.Estudiante;
import com.hass200.learning.backend_has200.repository.IEstudianteRepository;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@Log4j2
public class EstudianteService{

    private final IEstudianteRepository repository;
    private final PasswordEncoder encoder;
    private final Clock reloj;

    @Autowired
    public EstudianteService(IEstudianteRepository repository, PasswordEncoder encoder, Clock reloj){
        this.repository = repository;
        this.encoder = encoder;
        this.reloj = reloj;
    }

    //endpoint para dev
    public List<EstudianteResponse> listar(){
        log.info("Listando estudiantes");
        return repository.findAll().stream()
                .map(EstudianteResponse::from)
                .toList();
    }

    @Transactional
    public EstudianteResponse registrar(RegistroRequest request){
        String correo = request.correo().trim().toLowerCase(Locale.ROOT);
        String alias = request.alias().trim();

        if(repository.existsByCorreo(request.correo())){
            throw new ConflictoException("El correo ya está registrado");
        }

        if(repository.existsByAlias(request.alias())){
            throw new ConflictoException("Este alias ya está en uso");
        }

        Instant ahora = Instant.now(reloj);
        log.info("Creando nuevo estudiante");
        Estudiante nuevo = Estudiante.builder()
                .correo(correo)
                .alias(alias)
                .contrasenaHash(encoder.encode(request.contrasena()))
                .politicaAceptadaEn(ahora)
                .creadoEn(ahora)
                .build();
        return EstudianteResponse.from(repository.save(nuevo));
    }

}
