// Texto para el estudiante a partir de un ApiError del módulo de exámenes.
// `m` = t.value.examenes.errors. Se decide por `codigo` (nunca por `detail`, que es texto para depurar).
export function examMessage(m, e) {
  if (!e) return ''
  if (e.codigo && m.codes[e.codigo]) return m.codes[e.codigo]
  if (e.code === 'network') return m.network
  if (e.code === 'session') return m.session
  if (e.code === 'rate') return m.rate
  return m.generic
}
