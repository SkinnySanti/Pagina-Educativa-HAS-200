# Tutor virtual: guía de integración

El tutor responde dudas sobre el HAS-200 y las guías usando la API de **Groq** (plan gratuito). El navegador nunca habla con Groq: llama a tu backend y el backend usa la API key.

```
Vue (/tutor) ──POST /api/tutor/chat + Bearer JWT──▶ Spring (TutorController → TutorService) ──▶ Groq
                                                      │ límites por estudiante y globales
                                                      └ conocimiento: resources/tutor/*.md
```

## 1. Dónde va la API key (lo único que tienes que configurar)

Variable de entorno **`GROQ_API_KEY`**. Nunca en el código, ni en `application.yaml`, ni en el frontend, ni en Git.

- **Local (IntelliJ):** Run → Edit Configurations → Environment variables → `GROQ_API_KEY=tu_key` (junto a las que ya usas: `PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`).
- **Local (terminal):** `export GROQ_API_KEY=tu_key` antes de `./mvnw spring-boot:run`.
- **Producción:** en el panel de variables de entorno de tu hosting (el `Dockerfile` ya lee el entorno).

Si falta, la app arranca igual y el tutor responde 503 `TUTOR_NO_DISPONIBLE`. Nada de lo anterior se rompe.

## 2. Archivos nuevos

**Backend** (`backend/src/main/java/com/hass200/learning/backend_has200/`)

| Archivo | Para qué sirve |
|---|---|
| `controller/TutorController.java` | `POST /api/tutor/chat`. Ya queda protegido por tu `SecurityConfig` (`anyRequest().authenticated()`). |
| `service/TutorService.java` | Arma la conversación y llama a Groq; prueba el siguiente modelo si uno falla o se satura. |
| `service/TutorLimitador.java` | Límites por estudiante y de todo el sitio (en memoria). |
| `service/TutorConocimiento.java` | Lee `prompt-sistema.md` y `conocimiento-has200.md` al arrancar. |
| `config/TutorProperties.java` | Lee el bloque `app.tutor` del yaml. |
| `config/TutorConfig.java` | Crea el cliente HTTP hacia Groq (`RestClient`, sin dependencias nuevas). |
| `dto/request/TutorChatRequest.java`, `dto/response/TutorChatResponse.java` | Contrato de entrada y salida. |
| `resources/tutor/prompt-sistema.md` | Personalidad y reglas del tutor. |
| `resources/tutor/conocimiento-has200.md` | **Todo lo que sabe el tutor.** |

**Frontend** (`frontend/src/`)

| Archivo | Para qué sirve |
|---|---|
| `views/TutorView.vue` | Página `/tutor` (mismas medidas que Juegos y Exámenes). |
| `components/tutor/TutorHero.vue`, `TutorChat.vue`, `TutorSide.vue` | Banner, chat y panel lateral. |
| `composables/useTutorChat.js` | Estado del chat (en memoria; se borra al cerrar sesión). |
| `services/tutorService.js` | Llamada al backend con el `apiClient` que ya tienes (token y renovación incluidos). |
| `i18n/tutor.es.js`, `i18n/tutor.en.js` | Textos en español e inglés. |

## 3. Archivos existentes que se tocaron (solo se agregaron líneas)

| Archivo | Cambio |
|---|---|
| `backend/src/main/resources/application.yaml` | Bloque `app.tutor` al final. |
| `backend/README_ENDPOINTS.md`, `backend/README.md` | Sección 11 del tutor, una fila en la tabla de endpoints y una decisión abierta sobre datos personales. |
| `frontend/src/config/api.js` | `TUTOR_ENDPOINT` y `TUTOR_MAX_CHARS` al final. |
| `frontend/src/router/index.js` | Import y ruta `/tutor` con `requiresAuth`. |
| `frontend/src/components/layout/AppSidebar.vue` | El ítem "Tutor virtual" pasa de `to: null` a `to: '/tutor'`. |
| `frontend/src/i18n/inicio.es.js`, `inicio.en.js` | Importan `tutor` y el aviso de Inicio pasa de "Próximamente" a "Ya disponible". |

No se tocaron `SecurityConfig`, `CorsConfig`, `GlobalExceptionHandler`, `pom.xml` ni las migraciones de Flyway (no hay tablas nuevas).

## 4. Cómo ampliar lo que sabe el tutor

Edita `backend/src/main/resources/tutor/conocimiento-has200.md` (por ejemplo, con el contenido de las guías oficiales CONP 701 o de la sesión 2) y reinicia el backend. Ahora tiene unas 1.200 palabras, sacadas solo de lo que ya está en el proyecto.

Ojo con el tamaño: los límites gratuitos de Groq cuentan tokens (8.000 por minuto y 200.000 por día en los modelos `gpt-oss`). Mientras más largo el archivo, menos preguntas caben. Si lo haces crecer mucho, sube de plan o resume el contenido.

## 5. Límites ajustables (`application.yaml` → `app.tutor`)

| Clave | Valor inicial |
|---|---|
| `limite-por-minuto` / `limite-por-dia` (por estudiante) | 3 / 12 |
| `limite-global-por-minuto` / `limite-global-por-dia` (todo el sitio) | 6 / 150 |
| `modelos` (en orden) | `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `llama-3.1-8b-instant` |
| `max-tokens-respuesta` | 700 |

Los límites en memoria se reinician al reiniciar el backend y valen por instancia (con una sola instancia en el plan gratuito, no hay problema).

## 6. Prueba rápida

```bash
# 1) login
curl -s -X POST http://localhost:8080/api/auth/login -H 'Content-Type: application/json' \
  -d '{"correo":"tu@correo.com","contrasena":"tu-clave"}'
# 2) pregunta (pega el tokenAcceso)
curl -s -X POST http://localhost:8080/api/tutor/chat \
  -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' \
  -d '{"mensaje":"¿Qué hace un PLC?","historial":[],"idioma":"es"}'
```

Esperado: 200 con `respuesta` y `restantesHoy`; sin token, 401; sin `GROQ_API_KEY`, 503 `TUTOR_NO_DISPONIBLE`; al pasar el límite, 429.

## 7. Pendientes antes de publicar

- Verificar que el backend compila y las pruebas de la sección 6 (el código se revisó, pero no se compiló contra Spring en el entorno donde se escribió).
- **Datos personales de menores:** las preguntas viajan a Groq. Actualiza la política de tratamiento de datos para mencionar el tutor y a Groq, y revisa su política de datos (https://console.groq.com/docs/your-data).
- Los límites de Groq y los nombres de modelos cambian: confírmalos en https://console.groq.com/docs/rate-limits y en tu página de límites.
