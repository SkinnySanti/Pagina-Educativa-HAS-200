// Audios de las guías (página del Tutor virtual). Los MP3 viven en `public/audio/` y Vite/Vercel
// los sirven tal cual en `/audio/<archivo>`. Cada guía tiene un archivo por idioma; la página usa el del
// idioma activo (ES/EN) y, si falta el de un idioma, cae al español.
// El título y la transcripción salen del i18n (tutor.audios.items), en el MISMO orden que esta lista.
//
// Para cambiar un audio: reemplaza el archivo y, si ya estaba en producción, cámbiale el nombre
// (p. ej. guia-1-v2.mp3) y actualiza `src` aquí, así nadie se queda con la versión cacheada.
export const GUIDE_AUDIOS = [
  { id: 'guia-1', minutes: 2, src: { es: '/audio/guia-1.mp3', en: '/audio/guia-1-en.mp3' } },
  { id: 'guia-2', minutes: 2, src: { es: '/audio/guia-2.mp3', en: '/audio/guia-2-en.mp3' } },
]

export const audioSrc = (audio, lang) => audio.src[lang] ?? audio.src.es
