package com.hass200.learning.backend_has200.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ReglaNegocioException extends RuntimeException {

    private final HttpStatus status;
    private final String codigo;


    public ReglaNegocioException(String message, HttpStatus status, String codigo) {
        super(message);
        this.status = status;
        this.codigo = codigo;
    }

    public static ReglaNegocioException noEncontrado(String message, String codigo){
        return new ReglaNegocioException(message, HttpStatus.NOT_FOUND, codigo);
    }

    public static ReglaNegocioException conflicto(String message, String codigo){
        return new ReglaNegocioException(message, HttpStatus.CONFLICT, codigo);
    }

    public static ReglaNegocioException prohibido(String message, String codigo){
        return new ReglaNegocioException(message, HttpStatus.FORBIDDEN, codigo);
    }

    public static ReglaNegocioException invalido(String message, String codigo){
        return  new ReglaNegocioException(message, HttpStatus.BAD_REQUEST, codigo);
    }
}
