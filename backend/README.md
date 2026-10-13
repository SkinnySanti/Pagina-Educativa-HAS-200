# HAS-200 Learning: contexto general del backend (v3)

> Documento de traspaso. Pégalo como primer mensaje en un chat nuevo del proyecto.

## 0. Cómo quiero que trabajes conmigo en el backend

- Actúa **más como soporte y guía que como generador de código**: requisitos, dirección, revisión y explicación.
- **Genera código solo cuando yo lo pida.** Cuando lo pida, explica cada segmento, bean y componente.
- Trabajo módulo por módulo y tabla por tabla (entidad → repositorio → DTO → servicio → controlador). En correcciones entrega **solo el parche**, no el proyecto completo.
- Señálame errores pequeños y detalles de lo que te muestre, con tu opinión.
- Incluye fuentes y referencias cuando se pueda. Tono informal, en español.

## 1. Proyecto y stack

**HAS 200 Learning**: plataforma web bilingüe (ES/EN), 100 % educativa, alrededor del sistema integrado HAS-200 (mini fábrica automatizada de demostración). Incluye guías, exámenes y retroalimentación; el tutor de IA es por ahora solo un aviso.

- **Frontend:** Vue 3 + Vite. Ya existe, pero **aún no está conectado** al backend.
- **Backend:** Spring Boot, Java 21, paquete raíz `com.has200.learning`, estructura por funcionalidad (`auth`, `student`, `exam`, `attempt`, `progress`, `common`).
- **BD:** MySQL, con nombres de tablas y columnas en **español**. Esquema gestionado con **Flyway**; `ddl-auto=validate`, `open-in-view=false`.
- **Convenciones ya fijadas:**
    - Lombok en entidades y `LocalDateTime` para fechas. Todas las fechas se guardan en **UTC** y las asigna la app con un `Clock` UTC inyectado (nunca `LocalDateTime.now()` sin reloj).
    - DTOs como `record`. Las reglas de formato van con Bean Validation en el DTO; las reglas de negocio, en el servicio; la garantía final, en la BD (`UNIQUE`, `NOT NULL`, `CHECK`).
    - El servicio devuelve DTOs, no entidades.
    - Errores uniformes con `ProblemDetail` (`GlobalExceptionHandler`); `ConflictoException` → 409, `NoAutenticadoException` → 401.
    - Correo normalizado (trim y minúsculas) al registrar y al hacer login.

## 2. Reglas de negocio

- Un solo rol (estudiante). Sin ADMIN, sin tabla de roles.
- Exámenes definidos por el equipo (entran por migraciones/seed); la API solo los lee. Opción múltiple con **una sola correcta**.
- Contenido del examen sin cambio de idioma: 8 preguntas en español y 2 en inglés (fijo). Orden de preguntas y opciones preestablecido.
- Cada examen tiene tiempo límite (**máximo 1 hora**). El servidor manda; el cronómetro del frontend es solo visual.
- Intentos ilimitados, **excepto diagnósticos (1 solo intento)**. Abandonar una diagnóstica **no** consume el intento; solo se consume al **enviarse**.
- Al terminar: por cada pregunta incorrecta, la respuesta correcta y el módulo donde se estudia. Las correctas nunca viajan al cliente durante el examen.
- Registro con correo, alias y contraseña (el nombre no se almacena). Sin verificación de correo. Aceptación obligatoria de la política de tratamiento de datos.

## 3. Modelo de datos (Flyway)

**V1 (aplicada):** `estudiante` (correo UNIQUE, alias UNIQUE de máx. 20, `contrasena_hash`, `politica_aceptada_en`, `creado_en`), `examen` (tipo `DIAGNOSTICO | FINAL`, `tiempo_limite_minutos`, `version`), `pregunta` (`posicion`, `enunciado`, `idioma` CHAR(2), `referencia_modulo` p. ej. `m1:3`), `opcion` (`posicion`, `texto`, `es_correcta`), `intento` (`estado`: `EN_CURSO | ENVIADO | VENCIDO`, `iniciado_en`, `vence_en`, `enviado_en`, `aciertos`, `total`, `puntaje`, `clave_intento_unico` UNIQUE nullable) y `respuesta_intento` (PK compuesta `intento_id + pregunta_id`, `opcion_id` nullable = sin responder). El borrado del estudiante hace cascada sobre intentos y respuestas.

**V2 (entregada, pendiente de aplicar):** `token_refresco` (`estudiante_id` con cascada, `token_hash` VARCHAR(64) UNIQUE, `creado_en`, `vence_en`, `revocado_en` nullable).

**Pendiente:** `progreso_guia` (hoy comentada en V1) irá en una **V3**.

## 4. Seguridad (versión 1)

- Login con correo y contraseña; BCrypt. Mismo error 401 ("Credenciales inválidas") para correo inexistente o contraseña mala, con un hash falso para igualar tiempos.
- **Access token:** JWT HS256 de **15 minutos** (`sub` = id del estudiante, más `alias`, `iss`, `iat`, `exp`). Clave de 32 bytes en Base64 desde la variable de entorno `JWT_SECRET`, validada al arrancar.
- **Refresh token:** valor aleatorio opaco (256 bits), vigencia de **7 días**, guardado **hasheado** (SHA-256) en BD, con **rotación** en cada uso y **detección de reutilización** (si se presenta uno ya revocado, se revocan todos los del estudiante). Usa `@Transactional(noRollbackFor = NoAutenticadoException.class)` para que esa revocación masiva no se deshaga.
- Configuración con `@ConfigurationProperties` validadas (`app.jwt.*`). Spring Security como Resource Server stateless; públicos solo `register`, `login`, `refresh` y `logout`; el 401 sale en formato `ProblemDetail`.
- **Decisión para esta versión:** ambos tokens viajan en el cuerpo JSON y el frontend los guarda en `localStorage`. **Riesgo aceptado:** un XSS podría robarlos. Mitigaciones actuales: access de 15 min, rotación y detección de reutilización. Buenas prácticas del frontend: no usar `v-html` con contenido no confiable y, más adelante, añadir una Content-Security-Policy.
- **Planificado para una versión posterior:** refresh en cookie `HttpOnly` (`Secure`, `SameSite=Strict`, `Path=/api/auth`), con CORS de lista cerrada y verificación de `Origin` en refresh/logout. El diseño ya está hecho (`CookieProperties`, `RefreshCookieService`, `OrigenValidator`, `SesionEmitida`, controlador leyendo la cookie, `TokenResponse` sin el refresh); se aplica como parche.

## 5. Estado del desarrollo

### Hecho
- Proyecto Spring, conexión a MySQL, Flyway funcionando, primer seed y configuración inicial.
- **Paso 1:** `estudiante` completo (entidad, repositorio, DTOs, servicio, `POST /api/auth/register`), **probado**: 201, 409 (correo o alias duplicado) y 400 (validaciones por campo).
- Manejo global de errores y bean `Clock` UTC.

### Entregado en el chat, pendiente de verificar
- **Paso 2:** `V2`, `JwtProperties`, `JwtConfig` (clave, encoder, decoder), `JwtService`, `TokenRefresco` y su repositorio, `AuthService`, `AuthController` (`login`, `refresh`, `logout`), `SecurityConfig` con Resource Server y `GET /api/me`.
- **Pruebas a hacer:** login devuelve ambos tokens; `/me` da 200 con token, 401 sin token y con token alterado; credenciales malas dan la misma respuesta; `refresh` rota y reutilizar el viejo revoca todo; `logout` invalida el refresh.

## 6. Endpoints

| Método | Ruta | Estado |
|---|---|---|
| POST | `/api/auth/register` | Hecho y probado |
| POST | `/api/auth/login`, `/refresh`, `/logout` | Entregado, por verificar |
| GET | `/api/me` | Entregado, por verificar |
| DELETE | `/api/me` | Pendiente |
| GET | `/api/exams` | Pendiente |
| POST | `/api/exams/{id}/attempts` | Pendiente (iniciar o reanudar) |
| POST | `/api/attempts/{id}/submit` | Pendiente |
| GET | `/api/attempts/{id}/review` | Pendiente |
| GET | `/api/me/attempts` | Pendiente |
| GET / PUT | `/api/me/progress` | Pendiente |
| POST | `/api/auth/forgot-password`, `/reset-password` | Pendiente (al final) |

## 7. Pendientes del backend, en orden

1. **Verificar el paso 2** con la lista de pruebas de arriba. Aplicar la V2.
2. **Paso 2b, límite de intentos fallidos de login.** Opción simple: contador en memoria (Caffeine o Bucket4j) por IP y correo, que se reinicia con la app. Alternativa: columnas en una migración nueva.
3. **Conexión con el frontend:** proxy de Vite hacia `localhost:8080` (evita CORS en desarrollo) o un `CorsConfigurationSource` con el origen exacto. Perfiles `dev`/`prod`.
4. **Paso 3, `examen` / `pregunta` / `opcion`:** entidades de solo lectura y `GET /api/exams` (tipo, tiempo y si la diagnóstica ya se usó). DTO para rendir el examen **sin** `es_correcta`. Seed del contenido real de los exámenes.
5. **Paso 4, `intento` / `respuesta_intento`:** iniciar o reanudar, enviar y calificar, revisión. Vencimiento "perezoso" (se califica al consultar o enviar si ya venció, con unos segundos de gracia). `clave_intento_unico` solo se llena al pasar a `ENVIADO` en diagnósticos. Respuestas con PK compuesta (`@EmbeddedId`).
6. **Historial** de intentos y puntajes (alimenta Retroalimentación).
7. **Progreso de guías:** migración V3, entidad y `GET/PUT /api/me/progress` (reemplaza el `localStorage` actual de `useGuideProgress.js`).
8. **`DELETE /api/me`** (derecho de supresión; la cascada de BD limpia intentos y tokens).
9. **Pruebas automáticas** de reglas críticas: la diagnóstica no admite un segundo intento enviado (ni con dos peticiones simultáneas), un envío fuera de tiempo no cuenta como válido, la respuesta correcta no aparece al iniciar un intento, y el flujo de refresh con rotación y reutilización. Los tests necesitarán `JWT_SECRET` propio.
10. **Cierre intermedio:** Docker Compose con MySQL y OpenAPI (springdoc). Tarea programada que borre refresh tokens vencidos.
11. **Recuperación de contraseña por correo** (fase final): token aleatorio de un solo uso guardado hasheado, expiración corta, respuesta idéntica exista o no el correo, Spring Mail con SMTP.
12. **Endurecimiento (versión posterior):** refresh en cookie HttpOnly (parche ya diseñado), Content-Security-Policy, ventana de gracia para varias pestañas o peticiones simultáneas de refresh, gestión de secretos en producción, HTTPS.

## 8. Decisiones abiertas

- **Menores de edad:** opción A (plataforma para mayores de 18, con declaración al registrarse) u opción B (aceptar menores con autorización del representante legal). Ley 1581 de 2012 y sus decretos reglamentarios.
- **Texto de la política de tratamiento de datos** y quién figura como responsable.
- **Plataforma tipo Moodle** (actividades, guías, evaluaciones): sin decidir; conviene resolverlo antes de Exámenes en el frontend.
- Si en el futuro se quiere que abandonar la diagnóstica **consuma** el intento (hoy hay una fuga: se pueden ver las preguntas sin enviar).

## 9. Lecciones y detalles técnicos ya encontrados

- `@AllArgsConstructor` de Lombok genera un constructor con **todos** los campos (incluido `id`) y en orden de declaración; mejor usar `@Builder` o un constructor propio. `@Data` en entidades es problemático (`equals`/`hashCode`, `toString` con el hash); preferible `@Getter` y `@ToString.Exclude`.
- `LocalDateTime` en UTC solo es coherente si **toda** la app usa el `Clock` UTC; el JSON los muestra sin zona, así que conviene exponer UTC con marca de zona y que el frontend convierta a hora local.
- Si la BD solo guarda la fecha, revisar con `SHOW CREATE TABLE` que la columna sea `datetime` y no `date`.
- Con `ddl-auto=validate`, una columna `CHAR` no coincide con un `String` mapeado como `VARCHAR`: `pregunta.idioma CHAR(2)` necesitará un ajuste de mapeo (por ejemplo `@JdbcTypeCode(SqlTypes.CHAR)`) al crear su entidad.
- `examen.version` es la versión del **contenido**: no mapearla con `@Version` (bloqueo optimista). Nómbrala `versionContenido` en la entidad.
- Los `CHECK` solo se hacen cumplir desde MySQL 8.0.16. La BD debe ser `utf8mb4`.
- BCrypt procesa máximo 72 bytes: tope de 64 caracteres en la contraseña. No editar migraciones ya aplicadas; crear una nueva.
- Lanzar una excepción dentro de un `@Transactional` hace rollback por defecto: usar `noRollbackFor` cuando el efecto previo debe persistir.

## 10. Frontend: lo que falta para integrar con el backend

Cliente HTTP con interceptor de 401 que renueve con **un solo refresh a la vez**; store de sesión (con ambos tokens en `localStorage` en esta versión); guardas de ruta; pantalla de login/registro con casilla de política (sin marcar por defecto) y confirmación de correo y contraseña; renovación preventiva con `expiraEnSegundos`; vista de Exámenes con etiqueta "EN" en las preguntas en inglés; vista de Retroalimentación; cambiar `useGuideProgress.js` por llamadas al backend. Pendientes de contenido: Guías Módulo 2, assets 3D e imágenes, tutor de IA y plataforma tipo Moodle.

## Referencias
- Ley 1581 de 2012: https://www.saludcapital.gov.co/Normo/gsp/ley_1581_de_2012.pdf
- Spring Security, Resource Server JWT: https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html
- OWASP, JWT para Java: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- OWASP, almacenamiento de contraseñas: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Spring Data JPA: https://docs.spring.io/spring-data/jpa/reference/
- Flyway: https://documentation.red-gate.com/fd/flyway-documentation-138346877.html