import { computed, ref, watch } from 'vue'
import { useAuth } from './useAuth.js'
import { MODULE1_STEPS, MODULE2_STEPS, useGuideProgress } from './useGuideProgress.js'
import * as examService from '../services/examService.js'
import * as examStorage from '../services/examStorage.js'

// Opciones de la página: 0 = Evaluación diagnóstica, 1 = Examen post recorrido.
// Módulos (cada opción tiene un examen por módulo): 0 = Módulo 1, 1 = Módulo 2.
export const OPTION_DIAGNOSTIC = 0
export const OPTION_POST = 1

const TIPO = ['DIAGNOSTICO', 'POST_RECORRIDO']
// `estado` del servidor (GET /api/exams) → estado de la interfaz.
const ESTADO = { DISPONIBLE: 'available', BLOQUEADO_GUIA: 'locked', USADO: 'used' }

// Estado de un examen en la interfaz (EL SERVIDOR es la fuente única de verdad, §9.4):
//   'login'     → no hay sesión (solo se ve; para presentarlo hay que iniciar sesión)
//   'loading'   → hay sesión y aún llega (o falló) la lista de exámenes
//   'locked'    → BLOQUEADO_GUIA: falta terminar la guía de ese módulo (solo post recorrido)
//   'available' → DISPONIBLE: se puede iniciar (o reanudar si tiene intento en curso)
//   'used'      → USADO: diagnóstico ya enviado (un solo intento)
export function useExamAccess() {
  const { isLoggedIn, user } = useAuth()
  const m1 = useGuideProgress('m1', MODULE1_STEPS)
  const m2 = useGuideProgress('m2', MODULE2_STEPS)

  // Avance LOCAL de las guías: solo alimenta la barra de la tarjeta. El desbloqueo lo decide el servidor
  // (leyendo progreso_guia), que hoy no recibe el avance hasta que exista PUT /api/me/progress (§11).
  const guides = computed(() => [
    { done: m1.complete.value, count: m1.count.value, total: MODULE1_STEPS },
    { done: m2.complete.value, count: m2.count.value, total: MODULE2_STEPS },
  ])

  /* ───────────── Lista de exámenes (GET /api/exams) ───────────── */
  const exams = ref([])
  const loadState = ref('idle') // 'idle' | 'loading' | 'ready' | 'error'
  const loadError = ref(null)
  const version = ref(0) // se incrementa en cada recarga: invalida lo que depende de localStorage
  let seq = 0

  async function reload() {
    if (!isLoggedIn.value) {
      seq++
      exams.value = []
      loadState.value = 'idle'
      loadError.value = null
      return
    }
    const mine = ++seq
    if (loadState.value !== 'ready') loadState.value = 'loading' // al refrescar no se parpadea: se conserva la lista
    try {
      const data = await examService.listExams()
      if (mine !== seq) return
      exams.value = Array.isArray(data) ? data : []
      loadError.value = null
      loadState.value = 'ready'
    } catch (e) {
      if (mine !== seq) return
      loadError.value = e
      if (!exams.value.length) loadState.value = 'error' // si ya había lista, se sigue mostrando
    } finally {
      if (mine === seq) version.value++
    }
  }
  watch(isLoggedIn, reload, { immediate: true })

  // Se identifica por tipo + módulo, nunca por `id` (§2.3).
  const examOf = (option, mod) => exams.value.find((x) => x.tipo === TIPO[option] && x.modulo === mod + 1) ?? null

  function statusOf(option, mod) {
    if (!isLoggedIn.value) return 'login'
    if (loadState.value !== 'ready') return 'loading'
    const ex = examOf(option, mod)
    return ex ? (ESTADO[ex.estado] ?? 'locked') : 'locked'
  }

  // Estado de una opción completa (para el selector de tipo de examen).
  function optionStatus(option) {
    if (!isLoggedIn.value) return 'login'
    const s = [0, 1].map((m) => statusOf(option, m))
    if (s.includes('loading')) return 'loading'
    if (s.includes('available')) return 'available'
    if (s.every((x) => x === 'used')) return 'used'
    return 'locked'
  }

  // Último intento ENVIADO de este examen en este navegador (parche temporal, ver examStorage).
  function lastAttemptId(option, mod) {
    void version.value
    const ex = examOf(option, mod)
    return ex && user.value ? examStorage.getLastAttempt(user.value.id, ex.codigo) : null
  }

  // "Completado" = al menos un intento ENVIADO. Para los diagnósticos lo dice el servidor (USADO);
  // para los post solo se sabe con el id guardado en este navegador, hasta que exista GET /api/me/attempts (§11).
  const isCompleted = (option, mod) => statusOf(option, mod) === 'used' || lastAttemptId(option, mod) !== null
  const completedCount = computed(() => [0, 1].reduce((n, o) => n + [0, 1].filter((m) => isCompleted(o, m)).length, 0))

  return {
    isLoggedIn,
    guides,
    loadState,
    loadError,
    reload,
    examOf,
    statusOf,
    optionStatus,
    lastAttemptId,
    isCompleted,
    completedCount,
  }
}
