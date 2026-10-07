import { computed, ref } from 'vue'

// Progreso de las guías, compartido entre Guías e Inicio (misma instancia).
// Se guarda en el navegador; cuando haya backend, solo se cambia este archivo.
const KEY = 'has200-guias-progress'
export const MODULE1_STEPS = 6
export const MODULE2_STEPS = 6

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}')
    const ok = (a) => (Array.isArray(a) ? a.filter((n) => Number.isInteger(n) && n >= 0) : [])
    return { m1: ok(raw.m1), m2: ok(raw.m2) }
  } catch {
    return { m1: [], m2: [] }
  }
}

const state = ref(read())

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state.value))
  } catch {
    /* si el navegador bloquea el almacenamiento, el avance dura solo la sesión */
  }
}

export function useGuideProgress(moduleId = 'm1', total = MODULE1_STEPS) {
  const seen = computed(() => new Set(state.value[moduleId]))
  const count = computed(() => seen.value.size)
  const complete = computed(() => count.value >= total)
  // Primer paso sin leer (o el primero, si ya terminó todo): de ahí se retoma.
  const resumeAt = computed(() => {
    for (let i = 0; i < total; i++) if (!seen.value.has(i)) return i
    return 0
  })

  function mark(i) {
    if (seen.value.has(i)) return
    state.value = { ...state.value, [moduleId]: [...state.value[moduleId], i] }
    save()
  }
  function reset() {
    state.value = { ...state.value, [moduleId]: [] }
    save()
  }

  return { seen, count, total, complete, resumeAt, mark, reset }
}
