package com.hass200.learning.backend_has200.auth;

import com.hass200.learning.backend_has200.models.Estudiante;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;

@Service
public class JwtService {
    private final JwtEncoder encoder;
    private final JwtProperties properties;
    private final Clock reloj;

    public JwtService(Clock clock, JwtEncoder jwtEncoder, JwtProperties jwtProperties) {
        this.reloj = clock;
        this.encoder = jwtEncoder;
        this.properties = jwtProperties;
    }

    public String generarTokenAcceso(Estudiante estudiante){
        Instant ahora = Instant.now(reloj);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(properties.issuer())
                .subject(String.valueOf(estudiante.getId()))
                .issuedAt(ahora)
                .expiresAt(ahora.plus(properties.accessTtl()))
                .claim("alias", estudiante.getAlias())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
