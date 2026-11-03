// Cálculos de la página de Retroalimentación. Son funciones puras: reciben los datos ya normalizados
// por services/feedbackService.js y devuelven lo que pintan los componentes.
//
// Forma de los datos normalizados:
//   attempts: [{ id, modulo, tipo: 'DIAGNOSTICO' | 'POST_RECORRIDO', estado: 'ENVIADO' | 'VENCIDO',
//                puntaje, aciertos, total, segundos, fecha }]
//   compare:  { 1: { diag: { id, puntaje } | null, post: { id, puntaje } | null,
//                    skills: { INGLES: { diag: [aciertos, total] | null, post: [aciertos, total] | null }, … } }, 2: … }
//   errors:   [{ modulo, habilidad, concepto, ref, idioma, enunciado, marcada | null, correcta, explicacion }]

export const SKILL_KEYS = ['INGLES', 'FUNCIONAMIENTO', 'TERMINOS_TECNICOS', 'PENSAMIENTO_SISTEMICO']
export const GOAL = 80 // % desde el que una habilidad es Fortaleza (umbral por confirmar)
export const LOW = 50 // % por debajo del cual hay que reforzar (umbral por confirmar)
export const MODULES = [1, 2]

export const pct = (a, t) => (t ? Math.round((a * 100) / t) : 0)
export const levelOf = (p) => (p >= GOAL ? 'f' : p >= LOW ? 'p' : 'r')
export const signed = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0')
export const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export const validAttempts = (attempts) => (attempts || []).filter((a) => a.estado === 'ENVIADO')

/* ───────────── Estadísticas de arriba (4 tarjetas) ───────────── */
export function kpis(data) {
  const valid = validAttempts(data.attempts)
  const deltas = MODULES.map((m) => {
    const c = data.compare?.[m]
    return c?.diag && c?.post ? { modulo: m, delta: c.post.puntaje - c.diag.puntaje } : null
  }).filter(Boolean)
  const timed = valid.filter((a) => Number.isFinite(a.segundos))
  return {
    intentos: valid.length,
    vencidos: (data.attempts || []).length - valid.length,
    mejor: valid.length ? Math.max(...valid.map((a) => a.puntaje)) : 0,
    mejora: deltas.length ? Math.round(deltas.reduce((n, d) => n + d.delta, 0) / deltas.length) : null,
    mejoras: deltas, // [{ modulo, delta }]
    tiempo: timed.length ? Math.round(timed.reduce((n, a) => n + a.segundos, 0) / timed.length) : null,
  }
}

/* ───────────── Progreso por intento (gráfica de líneas) ─────────────
   Por módulo: la diagnóstica primero y luego los últimos post (máx. 5), en orden cronológico. */
export function progressSeries(data) {
  const valid = validAttempts(data.attempts)
  const series = MODULES.map((m) => {
    const list = valid.filter((a) => a.modulo === m).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    const diag = list.find((a) => a.tipo === 'DIAGNOSTICO')
    // `n` = número real del post dentro del módulo (Post 1, Post 2…), aunque solo se muestren los últimos 5.
    const posts = list.filter((a) => a.tipo === 'POST_RECORRIDO').map((a, i) => ({ ...a, n: i + 1 })).slice(-5)
    return { modulo: m, items: [...(diag ? [{ ...diag, n: 0 }] : []), ...posts] }
  }).filter((s) => s.items.length)
  return { series }
}

/* ───────────── Habilidades ─────────────
   Suma, por habilidad, los aciertos de los dos módulos. `diag` = diagnóstica, `post` = intento post más reciente. */
function sumSkill(data, key, which) {
  let a = 0
  let t = 0
  for (const m of MODULES) {
    const pair = data.compare?.[m]?.skills?.[key]?.[which]
    if (pair) {
      a += pair[0]
      t += pair[1]
    }
  }
  return t ? { a, t, p: pct(a, t) } : null
}

export function buildSkills(data) {
  return SKILL_KEYS.map((key) => ({ key, diag: sumSkill(data, key, 'diag'), post: sumSkill(data, key, 'post') }))
}
export const hasMode = (skills, mode) => skills.some((s) => s[mode])
// Con qué datos se habla de "tu nivel actual": el post si existe; si no, la diagnóstica.
export const basisOf = (skills) => (hasMode(skills, 'post') ? 'post' : 'diag')
// Porcentaje de una habilidad en un modo (0 si todavía no hay datos de ese modo).
export const valueOf = (s, mode) => s[mode]?.p ?? 0

/* ───────────── Conceptos más fallados ───────────── */
export function ranking(errors, limit = 5) {
  const counts = {}
  for (const e of errors || []) counts[e.concepto] = (counts[e.concepto] || 0) + 1
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([concepto, n]) => ({ concepto, n }))
}

/* ───────────── Qué reforzar ─────────────
   Habilidades por debajo de la meta (las 3 más bajas) y conceptos que más se repiten en los errores. */
export function reinforcePlan(skills, errors) {
  const basis = basisOf(skills)
  const focus = skills
    .filter((s) => s[basis])
    .map((s) => ({ key: s.key, p: s[basis].p }))
    .filter((x) => x.p < GOAL)
    .sort((a, b) => a.p - b.p)
    .slice(0, 3)
  return { basis, focus, concepts: ranking(errors, 4) }
}

export const joinList = (list, and) => (list.length < 2 ? (list[0] ?? '') : `${list.slice(0, -1).join(', ')} ${and} ${list[list.length - 1]}`)

/* ───────────── Textos ───────────── */
// `concepto` es una clave estable, no texto visible. Orden: textos de Retroalimentación → los de Exámenes → clave legible.
export function conceptLabel(t, key) {
  return t.retro.concepts[key] ?? t.examenes.result.concepts[key] ?? key.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
}

// Preguntas sugeridas para el tutor: hasta 2 por habilidad baja y 1 por el concepto más fallado.
export function tutorTips(t, plan) {
  const r = t.retro.reinforce
  const out = []
  for (const f of plan.focus.slice(0, 2)) out.push({ id: `s-${f.key}`, label: t.retro.skills.list[f.key].name, prompt: r.skillPrompts[f.key] })
  for (const c of plan.concepts.slice(0, 1)) {
    const name = conceptLabel(t, c.concepto)
    out.push({ id: `c-${c.concepto}`, label: name, prompt: r.conceptPrompt(name) })
  }
  return out
}
