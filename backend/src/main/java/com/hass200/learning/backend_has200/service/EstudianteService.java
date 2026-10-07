package com.hass200.learning.backend_has200.service;

import com.hass200.learning.backend_has200.auth.TokenRepository;
import com.hass200.learning.backend_has200.dto.request.RegistroRequest;
import com.hass200.learning.backend_has200.dto.response.EstudianteResponse;
import com.hass200.learning.backend_has200.exceptions.ConflictoException;
import com.hass200.learning.backend_has200.exceptions.NoAutenticadoException;
import com.hass200.learning.backend_has200.models.Estudiante;
import com.hass200.learning.backend_has200.repository.IEstudianteRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Service
@Log4j2
public class EstudianteService{

    private final IEstudianteRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder encoder;
    private final Clock reloj;

    @Autowired
    public EstudianteService(IEstudianteRepository repository, PasswordEncoder encoder, Clock reloj, TokenRepository tokenRepository){
        this.repository = repository;
        this.tokenRepository = tokenRepository;
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

    @Transactional(readOnly = true)
    public EstudianteResponse perfil(Long id){
        return repository.findById(id)
                .map(EstudianteResponse::from)
                .orElseThrow(()-> new NoAutenticadoException("Sesion invalida"));
    }

    /*SEGMENTO DE CÓDIGO PARA ELIMINAR CUENTA SI SE NECESITA
    * MODIFICAR EL ENTITY PARA APLICAR UN SOFTDELETE Y MODIFICAR VARIABLE BOOLEANA*/
//    @Transactional
//    public void eliminar(Long id){
//        log.info("Eliminando estudiante");
//        tokenRepository.revocarTodosDelEstudiante(id,Instant.now(reloj));
//        repository.deleteById(id);
//    }
}
