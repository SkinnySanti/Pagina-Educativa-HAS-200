CREATE TABLE token_refresco(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    creado_en DATETIME NOT NULL,
    vence_en DATETIME NOT NULL,
    revocado_en DATETIME NULL,
    CONSTRAINT fk_token_refresco_estudiante
        FOREIGN KEY (estudiante_id)
        REFERENCES estudiante(id)
        ON DELETE CASCADE
);