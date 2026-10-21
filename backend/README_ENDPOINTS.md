# HAS-200 Learning: módulo de autenticación, contrato para el frontend (v1)

> Documento de integración Vue ↔ Spring Boot. Describe solo autenticación: endpoints, qué espera cada uno y cómo debe comportarse el cliente.

## 1. Resumen

- **Base:** `http://localhost:8080` en desarrollo. Todas las rutas empiezan por `/api`.
- **Formato:** JSON en UTF-8 (`Content-Type: application/json`), tanto en peticiones como en respuestas.
- **Sesión:** dos tokens.
  - **Token de acceso:** JWT que dura **15 minutos**. Va en el header `Authorization: Bearer <tokenAcceso>`.
  - **Token de refresco:** valor opaco que dura **7 días** y sirve para pedir un par nuevo. **Rota en cada uso.**
- **En esta versión ambos tokens se guardan en `localStorage`.** En una versión posterior el refresco pasará a una cookie `HttpOnly` y el contrato cambiará (ver sección 10).
- **Importante para desarrollo:** el backend **todavía no tiene CORS configurado**. Usa el proxy de Vite (`/api` → `http://localhost:8080`) y llama siempre a rutas relativas (`/api/auth/login`). Sin proxy, el navegador bloqueará las peticiones.

## 2. Flujo general

1. **Registro** (`/api/auth/register`) crea la cuenta pero **no inicia sesión**. Después hay que llamar a login (o llevar al usuario a la pantalla de login).
2. **Login** devuelve los dos tokens. Se guardan.
3. **Peticiones protegidas** llevan el header `Authorization: Bearer ...`.
4. Si el token de acceso vence (401), se **renueva** con `/api/auth/refresh`. Esa respuesta trae un par nuevo que **reemplaza a ambos**.
5. **Logout** (`/api/auth/logout`) invalida el refresco en el servidor; el cliente borra todo.

## 3. Endpoints

| Método | Ruta | Acceso | Respuesta OK |
|---|---|---|---|
| POST | `/api/auth/register` | Público | 201 + estudiante |
| POST | `/api/auth/login` | Público | 200 + tokens |
| POST | `/api/auth/refresh` | Público | 200 + tokens |
| POST | `/api/auth/logout` | Público | 204 sin cuerpo |
| GET | `/api/me` | Protegido | 200 + estudiante |

Todo lo que no sea esos cuatro `auth` exige `Authorization: Bearer`.

### 3.1 POST `/api/auth/register`

**Cuerpo:**

```json
{
  "correo": "ana@correo.com",
  "alias": "ana_01",
  "contrasena": "clave12345",
  "politicaAceptada": true
}
```

| Campo | Regla |
|---|---|
| `correo` | Obligatorio, formato de correo válido, máx. 255 |
| `alias` | Obligatorio, 3 a 20 caracteres: letras, números o guion bajo (`^[A-Za-z0-9_]{3,20}$`) |
| `contrasena` | Obligatoria, de 8 a 64 caracteres |
| `politicaAceptada` | Debe ser `true` (casilla sin marcar por defecto) |

- La **confirmación de correo y de contraseña** se valida solo en el frontend. No hace falta enviarla.
- El servidor limpia espacios y pasa el correo a minúsculas; el correo que devuelve ya está normalizado.

**201:**

```json
{ "id": 1, "correo": "ana@correo.com", "alias": "ana_01", "creadoEn": "2026-10-07T05:23:10Z" }
```

`creadoEn` es una fecha ISO-8601 en **UTC**. Si llega sin el sufijo `Z`, igual debe interpretarse como UTC antes de convertirla a hora local.

**Errores:** 400 (validación, con detalle por campo) y 409 (correo o alias ya existentes).

### 3.2 POST `/api/auth/login`

**Cuerpo:**

```json
{ "correo": "ana@correo.com", "contrasena": "clave12345" }
```

| Campo | Regla |
|---|---|
| `correo` | Obligatorio, máx. 255 (no se valida el formato aquí) |
| `contrasena` | Obligatoria, máx. 128 |

**200:**

```json
{
  "tipo": "Bearer",
  "tokenAcceso": "eyJhbGciOi...",
  "expiraEnSegundos": 900,
  "tokenRefresco": "q7H2...(43 caracteres)"
}
```

- `expiraEnSegundos` es la duración del token de acceso (900). El cliente debe calcular al recibirlo `accessExpiraEn = Date.now() + expiraEnSegundos * 1000` y guardarlo.
- El backend **no recibe** la casilla de política en el login: la aceptación se registra una sola vez, al crear la cuenta. Si la casilla del login es solo un requisito de la interfaz, no se envía nada. Si se necesita dejar constancia en cada inicio de sesión, habría que añadir un campo en el backend.

**Errores:** 400 (campo vacío o demasiado largo) y 401 (credenciales inválidas).

### 3.3 POST `/api/auth/refresh`

**Cuerpo:**

```json
{ "tokenRefresco": "q7H2..." }
```

| Campo | Regla |
|---|---|
| `tokenRefresco` | Obligatorio, máx. 128 |

**200:** mismo formato que el login, con un par **nuevo**.

> **El refresco usado queda invalidado al instante.** El cliente debe sustituir **los dos** tokens en `localStorage` con el par nuevo antes de hacer cualquier otra cosa.

**Errores:** 400 (campo faltante) y 401 con uno de estos `detail`:
- `Token de refresco inválido` (no existe, o ya fue usado).
- `Token de refresco vencido`.
- `Sesión inválida` (la cuenta ya no existe).

**Detección de reutilización:** si se presenta un refresco que ya fue usado, el servidor lo interpreta como posible robo, responde 401 y **revoca todos los refrescos de ese estudiante**. Consecuencia práctica: dos renovaciones simultáneas con el mismo token cierran la sesión.

### 3.4 POST `/api/auth/logout`

**Cuerpo:** igual que `/refresh` (`{ "tokenRefresco": "..." }`).

**204 sin cuerpo.** Es idempotente: responde 204 aunque el token no exista o ya esté revocado (siempre que el cuerpo sea válido). Errores: 400 si falta `tokenRefresco`.

- El token de acceso **no se puede revocar** en el servidor: sigue siendo válido hasta que expire (máx. 15 min). "Cerrar sesión" efectivo = llamar a logout **y** borrar los tokens del cliente.
- El cliente debe borrar `localStorage` **aunque logout falle** (red caída, 401, etc.).

### 3.5 GET `/api/me`

**Header obligatorio:** `Authorization: Bearer <tokenAcceso>`. Sin cuerpo.

**200:**

```json
{ "id": 1, "correo": "ana@correo.com", "alias": "ana_01", "creadoEn": "2026-10-07T05:23:10Z" }
```

**401** si el token falta, es inválido o venció, o si la cuenta fue eliminada (`Sesión inválida`). Los datos se leen de la BD, no del token.

## 4. Formato de errores

Los errores siguen la forma de *Problem Details* (`Content-Type: application/problem+json`). Usa **`status`** y **`detail`**. Pueden aparecer campos extra (por ejemplo `instance`); no dependas de ellos.

**400, validación:** trae `errores` con un mensaje por campo.

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Datos inválidos",
  "errores": {
    "alias": "El alias debe tener de 3 a 20 caracteres: letras, números o guion bajo"
  }
}
```

**409, conflicto:**

```json
{ "type": "about:blank", "title": "Conflicto", "status": 409, "detail": "El correo ya está registrado" }
```

**401:**

```json
{ "type": "about:blank", "title": "No autenticado", "status": 401, "detail": "Credenciales inválidas" }
```

Sin token, o con un token inválido o vencido, el 401 trae `detail: "Token ausente, inválido o vencido"`.

### Mensajes conocidos

| Situación | `detail` |
|---|---|
| Correo ya registrado | `El correo ya está registrado` |
| Alias en uso | `El alias ya está en uso` |
| Choque simultáneo o alias con distinta capitalización | `El correo o el alias ya están en uso` (no asumas qué campo falló) |
| Política sin aceptar | `Debes aceptar la política de tratamiento de datos` (en `errores.politicaAceptada`) |
| Login incorrecto (correo inexistente o contraseña mala) | `Credenciales inválidas` (idéntico en ambos casos, a propósito) |

- Los mensajes por defecto de `@NotBlank`, `@Email` y `@Size` dependen del idioma de la JVM y pueden salir en inglés. Recomendación: validar primero en el frontend y, para los errores del servidor, mapear por **nombre de campo** (`errores.correo`, etc.) con tus propios textos i18n ES/EN.
- El alias se considera duplicado aunque cambie mayúsculas y minúsculas (depende de la colación de MySQL).

## 5. Resumen de códigos HTTP

| Código | Significa | Qué hacer |
|---|---|---|
| 200 / 201 / 204 | Correcto | Continuar |
| 400 | Datos inválidos | Mostrar `errores` por campo |
| 401 en `/login` | Credenciales inválidas | Mensaje genérico, no indicar cuál campo |
| 401 en `/refresh` | Refresco inválido, vencido o reutilizado | Borrar tokens y mandar al login |
| 401 en otra ruta | Acceso vencido o inválido | Intentar **un** refresh y reintentar la petición |
| 409 | Correo o alias en uso | Mostrar el `detail` |

## 6. Comportamiento esperado del cliente

**Qué guardar** (sugerencia de claves): `has200.accessToken`, `has200.refreshToken` y `has200.accessExpiraEn`. No guardes el perfil del usuario: se pide a `/api/me`.

**Interceptor de peticiones:**
1. Adjunta `Authorization: Bearer <tokenAcceso>` en toda petición a rutas protegidas.
2. Si la respuesta es 401 y la ruta **no** es de `/api/auth/*`: llama a `/refresh` **una sola vez**, reintenta la original **una sola vez** con el token nuevo; si el refresh falla, limpia la sesión y redirige al login.
3. **Excluye `/api/auth/*` del reintento** para no entrar en bucle.

**Un solo refresh a la vez (obligatorio):**
- Si varias peticiones reciben 401 al mismo tiempo, deben esperar **la misma** promesa de refresh, no lanzar una cada una. Si no, la detección de reutilización cierra la sesión.
- Con varias pestañas abiertas, `localStorage` es compartido: sincroniza con el evento `storage` (o la API Web Locks) para que no refresquen a la vez.

**Renovación preventiva:** programa una renovación unos 60 segundos antes de `accessExpiraEn`, para que no se corte nada a mitad de una acción.

**Arranque de la app:**
1. Lee `localStorage`.
2. Si hay token de acceso aún vigente, úsalo; si venció pero hay refresco, llama a `/refresh`.
3. Si no hay nada, estado anónimo.
4. El guard del router debe **esperar** a que termine este paso antes de decidir si una ruta es accesible. Con la sesión resuelta, carga el perfil con `/api/me`.

**Exámenes:** duran hasta 1 hora y el token de acceso 15 minutos, así que las renovaciones ocurrirán durante el examen. El cronómetro real lo lleva el servidor (el cliente solo lo muestra), y si el refresh fallara a mitad del examen, el estudiante vuelve a iniciar sesión y reanuda el intento. Conviene no perder localmente las respuestas ya marcadas.

## 7. Seguridad en el cliente (versión con `localStorage`)

- Cualquier XSS podría leer los tokens. Evita `v-html` con contenido no confiable, no cargues scripts de terceros innecesarios y planifica una Content-Security-Policy.
- Nunca pongas tokens en la URL ni los imprimas en consola o logs.
- Aísla todo el manejo de tokens en **un solo módulo** (por ejemplo `authStorage`). Así, cuando el refresco pase a la cookie `HttpOnly`, el cambio queda en un solo lugar.

## 8. Reglas que el frontend debe replicar para validar antes de enviar

- Correo con formato válido y confirmación idéntica; alias con el patrón de 3 a 20 caracteres (`A-Z`, `a-z`, `0-9`, `_`); contraseña de 8 a 64 caracteres y confirmación idéntica; casilla de política sin marcar por defecto y obligatoria para registrar.
- Recomendación de producto: pedir que el alias **no sea el nombre real**.

## 9. Prueba rápida de integración

1. `register` con datos válidos da 201. Repetirlo da 409. Con `politicaAceptada: false` o un alias inválido da 400 con `errores`.
2. `login` da dos tokens y `expiraEnSegundos: 900`. Con contraseña mala y con correo inexistente da el **mismo** 401.
3. `GET /api/me` con el token da 200; sin token o con el token alterado da 401.
4. `refresh` con el refresco entrega un par nuevo. Repetirlo con el **refresco anterior** da 401 y deja sin efecto el par nuevo (revocación masiva).
5. `logout` da 204; un `refresh` posterior con ese token da 401.

## 10. Lo que cambiará más adelante (avisos para el frontend)

- **Cookie `HttpOnly` para el refresco:** el refresco desaparecerá de las respuestas JSON; `/refresh` y `/logout` dejarán de recibir cuerpo (el navegador enviará la cookie solo) y las peticiones necesitarán enviar credenciales. Por eso conviene aislar el almacenamiento de tokens (sección 7).
- **Límite de intentos de login:** se espera un **429 Too Many Requests** tras varios intentos fallidos. El cliente debe mostrar un mensaje de espera y respetar un posible header `Retry-After`.
- **Nuevos endpoints:** `DELETE /api/me` (eliminar la cuenta) y recuperación de contraseña por correo (`forgot-password` / `reset-password`). Aún sin contrato definido.
- **CORS:** se configurará cuando se despliegue con orígenes separados; con el proxy de Vite no hace falta en desarrollo.

## 11. Tutor virtual

> Chat con un modelo de IA (Groq) que responde dudas sobre el HAS-200 y las guías. El frontend **nunca** habla con Groq: llama a este endpoint y el backend usa la API key, que vive solo en la variable de entorno `GROQ_API_KEY`.

| Método | Ruta | Acceso | Respuesta OK |
|---|---|---|---|
| POST | `/api/tutor/chat` | Protegido (Bearer) | 200 + `{ respuesta, restantesHoy }` |

**Cuerpo:**

```json
{
  "mensaje": "¿Qué hace un PLC?",
  "historial": [
    { "rol": "user", "contenido": "¿Qué es el HAS-200?" },
    { "rol": "assistant", "contenido": "Es una mini fábrica automática…" }
  ],
  "idioma": "es"
}
```

- `mensaje`: obligatorio, máximo **600** caracteres.
- `historial`: opcional, máximo 20 turnos (`rol` = `user` | `assistant`). Lo guarda el frontend en memoria; **el backend no guarda conversaciones**. Solo se reenvían al modelo los últimos `app.tutor.max-mensajes-historial`.
- `idioma`: opcional, `es` (por defecto) o `en`.

**Errores** (formato Problem Details de la sección 4; el frontend decide por `codigo`, no por `detail`):

| HTTP | `codigo` | Cuándo |
|---|---|---|
| 400 | (validación, con `errores`) | mensaje vacío o demasiado largo, rol inválido |
| 401 | (sin código) | token ausente, inválido o vencido |
| 429 | `TUTOR_LIMITE_USUARIO` | el estudiante agotó sus preguntas de las últimas 24 h |
| 429 | `TUTOR_LIMITE_RITMO` | demasiadas preguntas en un minuto |
| 429 | `TUTOR_LIMITE_GLOBAL` | tope de todo el sitio, o Groq saturado en todos los modelos |
| 503 | `TUTOR_NO_DISPONIBLE` | falta `GROQ_API_KEY`, Groq rechazó la key o no respondió |

Una pregunta que falla por 503 o por saturación de Groq **no** descuenta del límite del estudiante.

**Configuración** (`application.yaml`, prefijo `app.tutor`): modelos en orden de preferencia (si uno se satura o falla se usa el siguiente), límites por estudiante y globales, tokens máximos de respuesta y tiempo de espera. El conocimiento del tutor está en `src/main/resources/tutor/` (`prompt-sistema.md` y `conocimiento-has200.md`).

## Referencias
- RFC 6750, Bearer Token: https://datatracker.ietf.org/doc/html/rfc6750
- RFC 9457, Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457.html
- OWASP, HTML5 Security Cheat Sheet (Web Storage): https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- OWASP, JSON Web Token Cheat Sheet for Java: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- Vite, `server.proxy`: https://vite.dev/config/server-options.html#server-proxy
- Groq, límites de uso: https://console.groq.com/docs/rate-limits
- Groq, compatibilidad con la API de OpenAI: https://console.groq.com/docs/openai
