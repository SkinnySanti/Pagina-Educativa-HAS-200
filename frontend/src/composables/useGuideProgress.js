import { computed, ref, watch } from 'vue'
import { PROGRESS_ENDPOINT } from '../config/api.js'
import { request } from '../services/apiClient.js'
import { useAuth } from './useAuth.js'

// Progreso de las guías, compartido entre Guías, Inicio y Exámenes (misma instancia).
// FUENTE DE VERDAD = EL SERVIDOR (GET/PUT/DELETE /api/me/progress, CONTEXTO v1.1 §10.5): él decide
// BLOQUEADO_GUIA de los post recorrido leyendo este progreso. Pasos en base 0 (0 a 5); módulos 'm1' | 'm2' en minúscula.
//
//   server → lo que el servidor ya confirmó.
//   dirty  → pasos marcados aquí que el servidor aún no confirma (sin sesión, petición en vuelo o error de red).
//   state  = server ∪ dirty → lo que se pinta. Marcar es optimista: la interfaz responde al instante.
//
// Sin sesión la guía se puede leer y marcar, pero solo en memoria: al iniciar sesión se envía lo marcado,
// y al cerrarla se borra todo (el siguiente estudiante no hereda el avance del anterior).
export const MODULE1_STEPS = 6
export const MODULE2_STEPS = 6

const MODULES = ['m1', 'm2']
const LEGACY_KEY = 'has200-guias-progress' // versión anterior: avance en localStorage, sin cuenta

const empty = () => ({ m1: [], m2: [] })
const cleanSteps = (a) => (Array.isArray(a) ? a.filter((n) => Number.isInteger(n) && n >= 0 && n <= 5) : [])
const normalize = (d) => ({ m1: cleanSteps(d?.m1), m2: cleanSteps(d?.m2) })
const union = (a, b) => [...new Set([...a, ...b])].sort((x, y) => x - y)

const server = ref(empty())
const dirty = ref(empty())
const loadState = ref('idle') // 'idle' (sin sesión) | 'loading' | 'ready' | 'error'
const loadError = ref(null)
const saveError = ref(null) // último fallo al guardar un paso (los pasos quedan en `dirty` para reintentar)
const state = computed(() => ({ m1: union(server.value.m1, dirty.value.m1), m2: union(server.value.m2, dirty.value.m2) }))

const { user } = useAuth()
const loggedIn = () => user.value != null

/* ───────────── Cola: una operación a la vez, en orden ─────────────
   Evita que la respuesta de un PUT viejo pise a uno más reciente y que un GET llegue antes de un PUT pendiente. */
let chain = Promise.resolve()
function enqueue(fn) {
  const p = chain.then(fn)
  chain = p.catch(() => {})
  return p
}
/** Resuelve cuando no queda ninguna operación de progreso en vuelo (para pedir GET /api/exams ya actualizado). */
export const whenGuideSynced = () => chain

/* ───────────── Servidor ───────────── */
let seq = 0 // identifica la sesión de estudiante vigente: respuestas de una sesión anterior se ignoran

async function pushStep(mod, step, mine) {
  try {
    const data = await request(PROGRESS_ENDPOINT, { method: 'PUT', body: { modulo: mod, paso: step } }) // idempotente
    if (mine !== seq) return true
    server.value = normalize(data) // 200 con el estado completo: se reemplaza el local
    dirty.value = { ...dirty.value, [mod]: dirty.value[mod].filter((s) => s !== step) }
    saveError.value = null
    return true
  } catch (e) {
    if (mine !== seq) return true
    if (e?.status === 400) {
      // PASO_INVALIDO / validación: indica un bug del cliente; reintentar no sirve, se descarta ese paso.
      console.error('[guías] paso rechazado:', e.codigo || 'validación')
      dirty.value = { ...dirty.value, [mod]: dirty.value[mod].filter((s) => s !== step) }
      return true
    }
    saveError.value = e // red caída, 5xx o sesión vencida: el paso sigue en `dirty`
    return false
  }
}

// Envía todo lo pendiente; se detiene en el primer fallo (no se insiste en bucle).
async function flushDirty(mine) {
  if (!loggedIn() || loadState.value !== 'ready') return
  for (const mod of MODULES) {
    for (const step of [...dirty.value[mod]]) {
      if (mine !== seq) return
      if (!(await pushStep(mod, step, mine))) return
    }
  }
}

// El avance que el estudiante ya tenía en localStorage NO se migra solo (§10.5): se envía una vez, con un PUT por paso.
// La clave vieja se borra SOLO cuando el servidor ya confirmó todo (si falla la red, se vuelve a intentar).
function readLegacy() {
  try {
    return normalize(JSON.parse(localStorage.getItem(LEGACY_KEY) || '{}'))
  } catch {
    return empty()
  }
}
function clearLegacy() {
  try {
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* ignorar */
  }
}

async function load(mine) {
  if (loadState.value !== 'ready') loadState.value = 'loading'
  try {
    const data = await request(PROGRESS_ENDPOINT) // GET
    if (mine !== seq) return
    server.value = normalize(data)
    loadError.value = null
    loadState.value = 'ready'
  } catch (e) {
    if (mine !== seq) return
    loadError.value = e
    loadState.value = 'error'
    return
  }
  const legacy = readLegacy()
  // Se suma lo marcado sin sesión + el avance viejo, y se descarta lo que el servidor ya tiene.
  const pending = (m) => union(dirty.value[m], legacy[m]).filter((n) => !server.value[m].includes(n))
  dirty.value = { m1: pending('m1'), m2: pending('m2') }
  await flushDirty(mine)
  if (mine === seq && !saveError.value && !dirty.value.m1.length && !dirty.value.m2.length) clearLegacy()
}

// Cambio de estudiante: inicio de sesión (null → id), cierre (id → null) o cambio de cuenta.
watch(
  () => user.value?.id ?? null,
  (id, prev) => {
    seq++
    const mine = seq
    server.value = empty()
    if (prev != null) dirty.value = empty() // al salir de una cuenta no se arrastra su avance
    saveError.value = null
    loadError.value = null
    loadState.value = id == null ? 'idle' : 'loading'
    if (id != null) enqueue(() => load(mine))
  },
  { immediate: true },
)

/** Reintenta cargar el avance (si falló el GET) y enviar lo pendiente (si falló un PUT). */
export function retryGuideSync() {
  if (!loggedIn()) return chain
  const mine = seq
  return enqueue(() => (loadState.value === 'ready' ? flushDirty(mine) : load(mine)))
}

/** Estado de sincronización, para avisar al estudiante (GuiasView) o esperar a que termine (Exámenes). */
export function useGuideSync() {
  return {
    loadState,
    loadError,
    saveError,
    loggedIn: computed(() => user.value != null),
    // Hay pasos marcados que el servidor todavía no confirma
    pending: computed(() => dirty.value.m1.length + dirty.value.m2.length > 0),
    retry: retryGuideSync,
    whenSynced: whenGuideSynced,
  }
}

/* ───────────── API por módulo (la misma que ya usaban Guías, Inicio y Exámenes) ───────────── */
export function useGuideProgress(moduleId = 'm1', total = MODULE1_STEPS) {
  const seen = computed(() => new Set(state.value[moduleId]))
  const count = computed(() => seen.value.size)
  const complete = computed(() => count.value >= total)
  // true cuando el avance ya llegó del servidor (o no hay sesión y no hay nada que esperar)
  const ready = computed(() => loadState.value === 'ready' || loadState.value === 'idle')
  // Primer paso sin leer (o el primero, si ya terminó todo): de ahí se retoma.
  const resumeAt = computed(() => {
    for (let i = 0; i < total; i++) if (!seen.value.has(i)) return i
    return 0
  })

  function mark(i) {
    if (seen.value.has(i)) return
    dirty.value = { ...dirty.value, [moduleId]: [...dirty.value[moduleId], i] } // optimista
    if (loggedIn() && loadState.value === 'ready') {
      const mine = seq
      enqueue(() => flushDirty(mine))
    }
  }

  /**
   * DELETE /api/me/progress/{modulo}: reinicia SOLO este módulo. Vuelve a bloquear su post recorrido, pero no borra
   * intentos enviados ni cancela uno en curso. Es pesimista: el avance local solo cambia si el servidor confirma;
   * si falla, lanza el ApiError para que la interfaz lo muestre.
   */
  async function reset() {
    if (!loggedIn()) {
      dirty.value = { ...dirty.value, [moduleId]: [] }
      return
    }
    const mine = seq
    await enqueue(async () => {
      const data = await request(`${PROGRESS_ENDPOINT}/${moduleId}`, { method: 'DELETE' })
      if (mine !== seq) return
      server.value = normalize(data)
      dirty.value = { ...dirty.value, [moduleId]: [] }
    })
  }

  return { seen, count, total, complete, ready, resumeAt, mark, reset }
}
