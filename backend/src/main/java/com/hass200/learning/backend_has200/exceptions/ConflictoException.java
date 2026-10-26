package com.hass200.learning.backend_has200.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ConflictoException extends RuntimeException {

    private final HttpStatus status;
    private final String codigo;

    public ConflictoException(String message, HttpStatus status, String codigo) {
        super(message);
        this.status = status;
        this.codigo = codigo;
    }

    public static ConflictoException conflicto(String mensaje, String codigo){
        return new ConflictoException(mensaje, HttpStatus.CONFLICT, codigo);
    }
}
