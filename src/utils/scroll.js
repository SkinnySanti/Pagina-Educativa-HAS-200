// Desplaza suavemente hasta un elemento por id y le pasa el foco (accesibilidad).
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
