# HAS 200 Learning — Frontend (Vue 3 + Vite)

Módulos terminados en su alcance actual: **Inicio** (índice/dashboard educativo) y
**Guías → Módulo 1 · Guía informativa** (6 pasos con retos interactivos, ES/EN), más el
**Acceso** (login y registro), ya preparado para conectarse con el backend Spring (ver «Acceso»).
Pendientes, en este orden sugerido: Guías Módulo 2 → Exámenes → Retroalimentación.

## Requisitos
- Node.js 20.19+ o 22+ (`node -v`)

## Comandos
```bash
npm install      # una sola vez
npm run dev      # servidor de desarrollo → http://localhost:5173
npm run build    # genera /dist para producción
npm run preview  # sirve /dist para probarlo
```

## Estructura
```
src/
  main.js                 arranque de la app
  App.vue                 layout: sidebar + topbar + <RouterView>
  router/index.js         rutas (una por módulo)
  styles/tokens.css       colores, radios, tamaños  ← cambia el diseño aquí
  styles/base.css         reset, botones (con hover), tarjetas, foco
  i18n/es.js, en.js       TODOS los textos (español / inglés)
  data/sections.js        modelos 3D, imágenes y hotspots — reservado para Guías
  components/layout/      AppSidebar, AppTopbar
  components/common/      AppIcon, PlaceholderBox, LogoMark, WelcomePortrait
                          (ilustración de bienvenida), RevealOnScroll (fade-in
                          al hacer scroll), Viewer3D (reservado para Guías)
  components/inicio/      HeroBanner + HeroArt (ilustración decorativa),
                          WelcomeIntro, LearningPath, InfoNotices
                          — SectionNav, HasSection, ComponentCarousel,
                          IntegrationDiagram, GlossaryFaq: NO se usan en
                          Inicio actualmente, quedan listos para Guías
                          (ver comentario al inicio de views/InicioView.vue)
  views/InicioView.vue    arma la página de Inicio
public/assets/has200/     imágenes y .glb (general, seccion-a, seccion-b, seccion-c)
```

## Estado de Inicio (terminado en su alcance actual)
Índice/dashboard liviano: hero + ilustración decorativa, bienvenida, ruta de
aprendizaje (evaluación diagnóstica destacada + 3 tarjetas de módulo) y 2
avisos (bilingüismo, tutor IA). Con animación de entrada al hacer scroll y
hover en las tarjetas — todo respeta `prefers-reduced-motion` (ver
`base.css`) y usa `<button disabled>` reales (no `<span>`) para lo que aún
no existe, así el teclado y los lectores de pantalla los saltan
correctamente.

Pendiente real: todo esto es frontend (salvo el Acceso, que ya llama al backend; ver «Acceso») — no hay backend ni persistencia
todavía, y Guías/Exámenes/Retroalimentación no están construidos (por eso
sus botones dicen "Pronto").

## Guías (Módulo 1)
```
views/GuiasView.vue              arma la página: migas, héroe, selector de módulos, pasos + índice
components/guias/                GuideHero, ModulePicker, GuideToc, GuideStep (marco de cada paso),
                                 GuideIntro, GuideFinish
components/guias/steps/          Step1Flow … Step6Glossary (un archivo por paso)
composables/useGuideProgress.js  avance guardado en el navegador; lo comparten Guías e Inicio
i18n/guias.es.js, guias.en.js    TODOS los textos de Guías (misma estructura en los dos)
styles/guias.css                 clases compartidas (.g-chip, .g-tile, botones…)
```
- Los textos aceptan **negrita** con `**así**` (componente `RichText`, sin `v-html`).
- Los pasos guardan *estados* (no cadenas de texto), por eso al cambiar de idioma todo se traduce al instante.
- El avance (pasos leídos) se guarda en `localStorage` (`has200-guias-progress`) y se refleja en la tarjeta de Inicio.
- **Activar el Módulo 2:** en `ModulePicker.vue` pon `available: true` en `m2`, crea sus pasos y
  muestra su contenido en `GuiasView.vue` según el módulo elegido. Luego habilita el botón de la
  segunda tarjeta en `LearningPath.vue` (`links = ['/guias', '/guias?...', null]`).

## Cómo llenar el contenido real del HAS-200 (para el futuro módulo de Guías)
1. **Textos:** edita `src/i18n/es.js` y `src/i18n/en.js` (títulos, componentes, mecanismo, pasos, glosario).
   Cada sección tiene la misma estructura en los dos archivos.

## Cómo agregar un módulo nuevo (ej. Guías)
1. Crea `src/views/GuiasView.vue` (puedes reusar SectionNav/HasSection/etc., ver arriba).
2. Agrega la ruta en `src/router/index.js`.
3. En `AppSidebar.vue`, cambia `to: null` por `to: '/guias'` en el ítem `guias`
   (deja de verse como "Pronto").
4. En `LearningPath.vue`, quita `disabled` del botón correspondiente y dale una acción real
   (por ejemplo, navegar a la nueva ruta).

## Acceso (login y registro) — conexión con el backend Spring
Rutas `/login` y `/registro` (misma vista, `views/AuthView.vue`, sin menú lateral). En la barra superior
aparece «Iniciar sesión»; con la sesión iniciada se ve el alias y «Cerrar sesión», y `/login` y
`/registro` redirigen a Inicio. La política de datos se acepta **solo en el registro**.

### ¿Qué archivo maneja la conexión con el backend?
| Archivo | Para qué sirve |
| --- | --- |
| `src/config/api.js` | **Aquí se cambian la URL base, los endpoints y los nombres de campos de la respuesta.** |
| `src/services/authService.js` | Hace las peticiones `fetch` (login y registro) y convierte los errores HTTP en mensajes. |
| `src/composables/useAuth.js` | Guarda la sesión en el navegador (`localStorage`, clave `has200-auth`) y expone `authHeader()` para futuras peticiones protegidas. |

### Valores que debes reemplazar por los reales
| Qué | Dónde | Valor de ejemplo actual |
| --- | --- | --- |
| URL base del servidor | `.env` → `VITE_API_BASE_URL` (ver `.env.example`) | vacío (usa rutas relativas y el proxy) |
| Endpoint de login | `src/config/api.js` → `AUTH_ENDPOINTS.login` | `/api/auth/login` |
| Endpoint de registro | `src/config/api.js` → `AUTH_ENDPOINTS.register` | `/api/auth/register` |
| Campos de la respuesta | `src/config/api.js` → `AUTH_RESPONSE_FIELDS` | `token`, `alias`, `email` |
| Campos que se envían | `src/services/authService.js` (`login` y `register`) | `{ email, password }` y `{ email, alias, password }` |
| Proxy de desarrollo | `vite.config.js` → `server.proxy` | `http://localhost:8080` |

### Contrato que asume el frontend (ajústalo a lo que devuelva Spring)
- `POST` login → `200` con `{ "token": "...", "alias": "...", "email": "..." }`.
- `POST` registro → `200` o `201`, con o sin `token`. Con token inicia sesión; sin token manda al login con un aviso.
- Errores: `401/403` = credenciales incorrectas · `409` = correo o alias ya existe · `400/422` = datos no válidos ·
  otro código = error del servidor · sin respuesta = «no pudimos conectar con el servidor».

### Cómo conectarlo
1. Copia `.env.example` como `.env` y pon `VITE_AUTH_MOCK=false`.
2. Edita los endpoints en `src/config/api.js` (y los campos en `authService.js` si tu DTO usa otros nombres).
3. En desarrollo, `npm run dev` reenvía `/api/*` a Spring con el proxy, así que no necesitas CORS. Si Spring corre en otro puerto, cámbialo en `vite.config.js`.
4. En producción, define `VITE_API_BASE_URL` (ej. `https://api.midominio.com`) **antes** de `npm run build` y habilita CORS en Spring para el dominio del frontend.
- `VITE_AUTH_MOCK=true` simula login y registro sin backend (útil mientras Spring no esté listo).

### Notas
- El token se guarda en `localStorage` (accesible desde JavaScript). Si Spring usará una cookie de sesión `HttpOnly`, agrega `credentials: 'include'` en `post()` de `authService.js` y permite credenciales en el CORS de Spring.
- Las reglas de alias y contraseña están en `src/utils/validators.js`: deben coincidir con las validaciones de Spring.
- Los textos están en `src/i18n/auth.es.js` y `auth.en.js`. El texto de la política (`policy.text`) sigue pendiente.

```
views/AuthView.vue                  pestañas Iniciar sesión / Registrarse y recuadro de color que se desliza
components/auth/LoginForm.vue       formulario de login
components/auth/RegisterForm.vue    formulario de registro (con la casilla de la política)
components/auth/AuthField.vue       campo con ícono, ayuda, error y ver/ocultar contraseña
components/auth/PolicyDialog.vue    ventana con la política de datos
composables/useFormFields.js        estado y validación de los formularios
styles/auth.css                     estilos del Acceso (--form-w y --auth-min-h controlan ancho y alto)
```

## Accesibilidad incluida
Enlace "Saltar al contenido", pestañas con teclado (← → Inicio Fin), foco visible,
`prefers-reduced-motion`, menú lateral que no recibe foco cuando está cerrado en móvil,
`alt`/`aria-label` en visuales, y botones deshabilitados nativos (no spans) para lo que
todavía no está disponible.
