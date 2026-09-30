# HAS 200 Learning — Frontend (Vue 3 + Vite)

Módulo terminado en su alcance actual: **Inicio** (índice/dashboard educativo).
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

Pendiente real: todo esto es frontend — no hay backend ni persistencia
todavía, y Guías/Exámenes/Retroalimentación no están construidos (por eso
sus botones dicen "Pronto").

## Cómo llenar el contenido real del HAS-200 (para el futuro módulo de Guías)
1. **Textos:** edita `src/i18n/es.js` y `src/i18n/en.js` (títulos, componentes, mecanismo, pasos, glosario).
   Cada sección tiene la misma estructura en los dos archivos.
2. **Imágenes:** copia el archivo (WebP, ~1600 px, idealmente < 200 KB) a `public/assets/has200/seccion-a/`
   y en `src/data/sections.js` pon `img: { src: '/assets/has200/seccion-a/x.webp', alt: { es: '...', en: '...' } }`.
3. **Modelo 3D:** copia el `.glb` (idealmente < 5 MB, comprimido con glTF-Transform) a `public/assets/has200/...`
   y pon `model: '/assets/has200/seccion-a/parte.glb'`. Los hotspots se definen en el mismo archivo.
   La librería `<model-viewer>` solo se descarga si hay al menos un modelo configurado.
4. **Más o menos secciones:** agrega/quita entradas en `sections` (data) y en `sections` (i18n).

## Cómo agregar un módulo nuevo (ej. Guías)
1. Crea `src/views/GuiasView.vue` (puedes reusar SectionNav/HasSection/etc., ver arriba).
2. Agrega la ruta en `src/router/index.js`.
3. En `AppSidebar.vue`, cambia `to: null` por `to: '/guias'` en el ítem `guias`
   (deja de verse como "Pronto").
4. En `LearningPath.vue`, quita `disabled` del botón correspondiente y dale una acción real
   (por ejemplo, navegar a la nueva ruta).

## Accesibilidad incluida
Enlace "Saltar al contenido", pestañas con teclado (← → Inicio Fin), foco visible,
`prefers-reduced-motion`, menú lateral que no recibe foco cuando está cerrado en móvil,
`alt`/`aria-label` en visuales, y botones deshabilitados nativos (no spans) para lo que
todavía no está disponible.
