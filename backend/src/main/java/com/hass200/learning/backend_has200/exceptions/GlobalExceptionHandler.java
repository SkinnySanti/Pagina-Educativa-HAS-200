package com.hass200.learning.backend_has200.exceptions;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ConflictoException.class)
    ProblemDetail conflicto(ConflictoException exception){
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
                exception.getMessage());
        problemDetail.setTitle("Conflicto");
        return problemDetail;
    }

    //Excepciones de Autenticación
    @ExceptionHandler(NoAutenticadoException.class)
    ProblemDetail noAutenticado(NoAutenticadoException exception){
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, exception.getMessage());
        problemDetail.setTitle("No autenticado");
        return problemDetail;
    }

    //Excepciones de Validation
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                    HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Datos inválidos");
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fieldError -> errores.putIfAbsent(fieldError.getField(),fieldError.getDefaultMessage()));
        problemDetail.setProperty("errores", errores);
        return ResponseEntity.badRequest().body(problemDetail);
    }
}
