// Datos NO traducibles de la página de inicio: rutas de modelos 3D, imágenes y hotspots.
// Los textos (títulos, descripciones, pasos) viven en src/i18n/es.js y en.js.

// Modelo 3D del sistema completo (hero). Pon la ruta cuando exista el .glb.
// Ejemplo: '/assets/has200/general/has200.glb'
export const HERO_MODEL = null

/*
  Cada sección:
  - model:      ruta a un .glb (o null mientras no exista)
  - hotspots:   puntos informativos sobre el modelo 3D. Ejemplo:
                { pos: '0 1.2 0', normal: '0 1 0', label: { es: 'Sensor', en: 'Sensor' } }
                (pos/normal son coordenadas 3D del modelo; se ajustan probando en
                https://modelviewer.dev/editor/)
  - components: una entrada por cada componente, en el mismo orden que en es.js/en.js.
                img: null  -> muestra un placeholder
                img: { src: '/assets/has200/seccion-a/sensor.webp', alt: { es: '...', en: '...' } }
*/
export const sections = [
  { id: 'a', model: null, hotspots: [], components: [{ img: null }, { img: null }, { img: null }, { img: null }] },
  { id: 'b', model: null, hotspots: [], components: [{ img: null }, { img: null }, { img: null }, { img: null }] },
  { id: 'c', model: null, hotspots: [], components: [{ img: null }, { img: null }, { img: null }, { img: null }] },
]
