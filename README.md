# HAS 200 Learning — Frontend (Vue 3 + Vite)

Módulo terminado: **Inicio** (landing educativa).
Pendientes, en este orden sugerido: Guías → Exámenes → Retroalimentación.

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
  styles/base.css         reset, botones, tarjetas, foco
  i18n/es.js, en.js       TODOS los textos (español / inglés)
  data/sections.js        modelos 3D, imágenes y hotspots (datos no traducibles)
  components/layout/      AppSidebar, AppTopbar
  components/common/      AppIcon, PlaceholderBox, Viewer3D, LogoMark
  components/inicio/      Hero, SectionNav, HasSection, ComponentCarousel,
                          IntegrationDiagram, GlossaryFaq
  views/InicioView.vue    arma la página de Inicio
public/assets/has200/     imágenes y .glb (general, seccion-a, seccion-b, seccion-c)
```

## Cómo llenar el contenido real del HAS-200
1. **Textos:** edita `src/i18n/es.js` y `src/i18n/en.js` (títulos, componentes, mecanismo, pasos, glosario).
   Cada sección tiene la misma estructura en los dos archivos.
2. **Imágenes:** copia el archivo (WebP, ~1600 px, idealmente < 200 KB) a `public/assets/has200/seccion-a/`
   y en `src/data/sections.js` pon `img: { src: '/assets/has200/seccion-a/x.webp', alt: { es: '...', en: '...' } }`.
3. **Modelo 3D:** copia el `.glb` (idealmente < 5 MB, comprimido con glTF-Transform) a `public/assets/has200/...`
   y pon `model: '/assets/has200/seccion-a/parte.glb'`. Los hotspots se definen en el mismo archivo.
   La librería `<model-viewer>` solo se descarga si hay al menos un modelo configurado.
4. **Más o menos secciones:** agrega/quita entradas en `sections` (data) y en `sections` (i18n), y ajusta
   los enlaces de `SectionNav.vue`.

## Cómo agregar un módulo nuevo (ej. Guías)
1. Crea `src/views/GuiasView.vue`.
2. Agrega la ruta en `src/router/index.js`.
3. En `AppSidebar.vue`, cambia `to: null` por `to: '/guias'` en el ítem `guias`
   (deja de verse como "Pronto").

## Accesibilidad incluida
Enlace "Saltar al contenido", pestañas con teclado (← → Inicio Fin), foco visible, `prefers-reduced-motion`,
menú lateral que no recibe foco cuando está cerrado en móvil, y `alt`/`aria-label` en visuales.
