package com.hass200.learning.backend_has200.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@ConfigurationProperties(prefix = "app.cors")
@Validated
public record CorsProperties(
        @NotEmpty List<@NotBlank String > allowedOrigins,
        @Positive long maxAgeSegundos
) {
    public CorsProperties{
        for(String origen : allowedOrigins){
            if(origen.equals("*") || origen.endsWith("/")){
                throw new IllegalArgumentException(
                        "Origen CORS inválido: '" + origen
                        + "' (sin comodín '*' y sin '/' final)");
            }
        }
    }

}
