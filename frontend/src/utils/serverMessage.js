// Convierte un error del servidor (ApiError) en el texto del idioma activo.
// `a` = t.value.auth. Se mapea por CÓDIGO/estado, nunca por el texto del backend (puede venir en inglés).
export function serverMessage(a, e) {
  if (!e) return ''
  const m = a.server
  if (e.code === 'rate') return e.retryAfter ? m.rateWait.replace('{s}', e.retryAfter) : m.rate
  return m[e.code] || m.server
}
