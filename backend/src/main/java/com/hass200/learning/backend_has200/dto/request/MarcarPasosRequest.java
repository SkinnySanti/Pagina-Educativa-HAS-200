package com.hass200.learning.backend_has200.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record MarcarPasosRequest(
        @NotNull @Pattern(regexp = "m[12]") String modulo,
        @NotNull @Min(0) Integer paso
) {
}
