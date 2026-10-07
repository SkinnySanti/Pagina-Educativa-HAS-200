package com.hass200.learning.backend_has200.auth;

import com.hass200.learning.backend_has200.auth.dto.LoginRequest;
import com.hass200.learning.backend_has200.auth.dto.RefreshRequest;
import com.hass200.learning.backend_has200.auth.dto.TokenResponse;
import com.hass200.learning.backend_has200.exceptions.NoAutenticadoException;
import com.hass200.learning.backend_has200.models.Estudiante;
import com.hass200.learning.backend_has200.repository.IEstudianteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

@Service
public class AuthService {

    private final IEstudianteRepository estudianteRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final Clock reloj;
    private final SecureRandom random = new SecureRandom();
    private final String hashFalso;

    public AuthService(IEstudianteRepository estudianteRepository,
                       TokenRepository tokenRepository, PasswordEncoder encoder,
                       JwtService jwtService, JwtProperties jwtProperties, Clock reloj) {
        this.estudianteRepository = estudianteRepository;
        this.tokenRepository = tokenRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
        this.reloj = reloj;
        this.hashFalso = encoder.encode("contrasena-falsa-para-igualar-tiempos");
    }

    @Transactional
    public TokenResponse login(LoginRequest request){
        String correo = request.correo().trim().toLowerCase(Locale.ROOT);
        Estudiante estudiante = estudianteRepository.findByCorreo(correo).orElse(null);

        //Setear el hash de contrasena para la validación
        String hash = estudiante != null ? estudiante.getContrasenaHash() : hashFalso;
        boolean coincide = encoder.matches(request.contrasena(), hash);

        if(estudiante == null || !coincide) throw new NoAutenticadoException("Credenciales invalidas");
        return emitirTokens(estudiante);
    }

    private TokenResponse emitirTokens(Estudiante estudiante){
        String acceso = jwtService.generarTokenAcceso(estudiante);
        String refresco = generarTokenOpaco();
        Instant ahora = Instant.now(reloj);
        tokenRepository.save(TokenRefresco.builder()
                .estudianteId(estudiante.getId())
                .tokenHash(sha256(refresco))
                .creadoEn(ahora)
                .venceEn(ahora.plus(jwtProperties.refreshTtl()))
                .build());
        return new TokenResponse("Bearer",acceso,
                jwtProperties.accessTtl().toSeconds(),refresco);
    }

    private String generarTokenOpaco(){
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    @Transactional(noRollbackFor = NoAutenticadoException.class)
    public TokenResponse refrescar(RefreshRequest request){
        Instant ahora = Instant.now(reloj);
        TokenRefresco actual = tokenRepository.findByTokenHash(sha256(request.tokenRefresco()))
                .orElseThrow(()-> new NoAutenticadoException("Token de refresco Invalido"));

        if(actual.estaRevocado()){
            tokenRepository.revocarTodosDelEstudiante(actual.getEstudianteId(), ahora);
            throw new NoAutenticadoException("Token de refresco inválido");
        }

        if(actual.estaVencido(ahora)){
            throw new NoAutenticadoException("Token de refresco vencido");
        }

        if (tokenRepository.revocarSiActivo(actual.getId(), ahora) == 0) {
            tokenRepository.revocarTodosDelEstudiante(actual.getEstudianteId(), ahora);
            throw new NoAutenticadoException("Token de refresco inválido");
        }

        Estudiante estudiante = estudianteRepository.findById(actual.getEstudianteId())
                .orElseThrow(() -> new NoAutenticadoException("Sesión invalida"));
        return emitirTokens(estudiante);
    }

    @Transactional
    public void cerrarSesion(RefreshRequest request){
        tokenRepository.findByTokenHash(sha256(request.tokenRefresco()))
                .ifPresent(t -> tokenRepository.revocarSiActivo(t.getId(), Instant.now(reloj)));
    }

    private String sha256(String valor){
        try{
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(messageDigest.digest(valor.getBytes(StandardCharsets.UTF_8)));
        }catch (NoSuchAlgorithmException e){
            throw new IllegalStateException(e);
        }
    }
}
