// Juegos de Educaplay que se muestran INCRUSTADOS (iframe) en la página Juegos (/juegos).
//
// ► AQUÍ SE AGREGA LA INTEGRACIÓN: en Educaplay abre la actividad → Compartir / Insertar,
//   copia SOLO el valor de src="…" del <iframe> y pégalo en `embedUrl` del juego que corresponda.
//   Mientras `embedUrl` esté vacío, la página muestra un aviso de "juego por configurar".
//
// El orden de este arreglo es el orden en pantalla. Los textos de cada juego (título, descripción,
// pasos) están en src/i18n/juegos.es.js y juegos.en.js, con la misma clave `id`.
//   modulo: 1 | 2  → etiqueta de módulo de la tarjeta
//   height: alto en px del marco del juego (cada actividad de Educaplay tiene su propia proporción)
export const JUEGOS = [
  { id: 'sopa', icon: 'grid', modulo: 1, embedUrl: 'https://es.educaplay.com/juego/31143381-sopa_de_letras_conceptos_clave_del_has_200.html', height: 600 },
  { id: 'cruci', icon: 'crossword', modulo: 2, embedUrl: 'https://es.educaplay.com/juego/31143423-crucigrama_del_sensor_a_la_pantalla.html', height: 640 },
  { id: 'ordenar', icon: 'sort', modulo: 1, embedUrl: 'https://es.educaplay.com/juego/31143470-palabras_clave_del_has_200.html', height: 560 },
  { id: 'memoria', icon: 'cards', modulo: 2, embedUrl: 'https://es.educaplay.com/juego/31148085-memoria_automatizacion_industrial_has_200.html', height: 600 },
]

// Solo se incrusta contenido https de Educaplay: si alguien pega otra URL por error, no se carga.
const EDUCAPLAY_HOSTS = ['educaplay.com']

export function safeEmbedUrl(url) {
  try {
    const u = new URL(url)
    const ok = u.protocol === 'https:' && EDUCAPLAY_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`))
    return ok ? u.href : ''
  } catch {
    return ''
  }
}
