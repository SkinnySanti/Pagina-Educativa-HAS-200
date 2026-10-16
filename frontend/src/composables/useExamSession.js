import { computed, onBeforeUnmount, ref } from 'vue'
import { useAuth } from './useAuth.js'
import * as examService from '../services/examService.js'
import * as examStorage from '../services/examStorage.js'

// Intento de examen en pantalla (CONTEXTO_FRONTEND_EXAMENES §5–§7 y §9.2–§9.3).
// Fases: 'idle' (solo la lista) → 'taking' (respondiendo) → 'submitting' → 'result' (nota + revisión).
// El SERVIDOR manda sobre el tiempo: el cronómetro es visual y siempre se calcula desde `venceEn`.
const FINAL_ERRORS = ['INTENTO_VENCIDO', 'DIAGNOSTICO_USADO', 'INTENTO_NO_ENCONTRADO'] // el intento no se puede reintentar

export function useExamSession({ onFinished } = {}) {
  const { user } = useAuth()

  const phase = ref('idle')
  const starting = ref(null) // id del examen cuya petición de inicio está en vuelo (deshabilita el botón)
  const attempt = ref(null) // respuesta de POST …/attempts + { codigo, skewMs }
  const meta = ref(null) // { codigo, tipo, modulo } del examen que se muestra
  const index = ref(0)
  const answers = ref({}) // { [preguntaId]: opcionId }
  const remainingMs = ref(0)
  const error = ref(null) // ApiError de iniciar/enviar
  const summary = ref(null) // { puntaje, aciertos, total }
  const review = ref(null)
  const reviewState = ref('idle') // 'idle' | 'loading' | 'ready' | 'error'
  const reviewError = ref(null)

  const total = computed(() => attempt.value?.preguntas.length ?? 0)
  const answeredCount = computed(() => Object.keys(answers.value).length)
  const active = computed(() => phase.value === 'taking' || phase.value === 'submitting')

  let timer = null
  let deadline = 0 // venceEn convertido a hora del cliente
  let autoTried = false
  let reviewId = null
  let gen = 0 // se incrementa al cerrar/empezar: ignora respuestas de peticiones viejas

  /* ───────────── Cronómetro ───────────── */
  function tick() {
    if (phase.value !== 'taking') return
    remainingMs.value = Math.max(deadline - Date.now(), 0) // siempre desde venceEn, no restando 1 s (§9.3)
    if (remainingMs.value === 0 && !autoTried) {
      autoTried = true // un solo auto-envío: si falla, el estudiante reintenta a mano (sin bucle)
      submit()
    }
  }
  function startTimer() {
    stopTimer()
    timer = setInterval(tick, 500)
    document.addEventListener('visibilitychange', tick) // las pestañas en segundo plano ralentizan los intervalos
  }
  function stopTimer() {
    if (timer) clearInterval(timer)
    timer = null
    document.removeEventListener('visibilitychange', tick)
  }

  // Con el examen abierto, recargar o cerrar la pestaña pide confirmación (el tiempo sigue corriendo en el servidor).
  const warnUnload = (ev) => {
    ev.preventDefault()
    ev.returnValue = ''
  }
  const guardUnload = (on) => window[on ? 'addEventListener' : 'removeEventListener']('beforeunload', warnUnload)

  /* ───────────── Iniciar / reanudar ───────────── */
  // Solo conserva marcas que existan en el intento (un valor viejo daría 400 OPCION_INVALIDA al enviar).
  function restore(data) {
    const saved = examStorage.loadAnswers(data.intentoId)
    const clean = {}
    for (const q of data.preguntas) {
      if (q.opciones.some((o) => o.id === saved[q.id])) clean[q.id] = saved[q.id]
    }
    return clean
  }

  function begin(data, exam) {
    gen++
    attempt.value = { ...data, codigo: exam.codigo }
    meta.value = { codigo: exam.codigo, tipo: data.tipo, modulo: data.modulo }
    summary.value = null
    review.value = null
    reviewState.value = 'idle'
    reviewError.value = null
    reviewId = null
    answers.value = data.reanudado ? restore(data) : {}
    const firstPending = data.preguntas.findIndex((q) => answers.value[q.id] == null)
    index.value = data.reanudado && firstPending > 0 ? firstPending : 0
    autoTried = false
    deadline = Date.parse(data.venceEn) - data.skewMs
    phase.value = 'taking'
    tick()
    startTimer()
    guardUnload(true)
  }

  async function start(exam) {
    if (starting.value !== null || active.value) return false // doble clic: una sola petición
    starting.value = exam.id
    error.value = null
    try {
      begin(await examService.startAttempt(exam.id), exam)
      return true
    } catch (e) {
      error.value = e
      return false
    } finally {
      starting.value = null
    }
  }

  /* ───────────── Responder y navegar ───────────── */
  function choose(questionId, optionId) {
    if (phase.value !== 'taking') return
    answers.value = { ...answers.value, [questionId]: optionId }
    examStorage.saveAnswers(attempt.value.intentoId, answers.value)
  }
  function clearChoice(questionId) {
    if (phase.value !== 'taking') return
    const next = { ...answers.value }
    delete next[questionId]
    answers.value = next
    examStorage.saveAnswers(attempt.value.intentoId, next)
  }
  function goTo(i) {
    if (phase.value !== 'taking' || !total.value) return
    index.value = Math.min(Math.max(i, 0), total.value - 1)
  }

  /* ───────────── Enviar ───────────── */
  function leave() {
    gen++
    stopTimer()
    guardUnload(false)
    phase.value = 'idle'
    attempt.value = null
    meta.value = null
    answers.value = {}
    summary.value = null
    review.value = null
    reviewState.value = 'idle'
    reviewError.value = null
    reviewId = null
  }

  async function submit() {
    if (phase.value !== 'taking') return
    const current = attempt.value
    const g = gen
    phase.value = 'submitting'
    error.value = null
    stopTimer()
    // Se envían las 10 (con null en las vacías) para que el cuerpo sea completo (§6).
    const respuestas = current.preguntas.map((q) => ({ preguntaId: q.id, opcionId: answers.value[q.id] ?? null }))
    try {
      const res = await examService.submitAttempt(current.intentoId, respuestas)
      if (g === gen) finish(current, res)
    } catch (e) {
      if (g === gen) onSubmitError(current, e)
    }
  }

  function finish(current, res) {
    examStorage.clearAnswers(current.intentoId) // solo tras un 200 (o un "ya enviado"), nunca antes (§6)
    if (user.value) examStorage.setLastAttempt(user.value.id, current.codigo, current.intentoId)
    guardUnload(false)
    summary.value = res ? { puntaje: res.puntaje, aciertos: res.aciertos, total: res.total } : null
    phase.value = 'result'
    onFinished?.() // refresca GET /api/exams: el diagnóstico pasa a USADO
    loadReview(current.intentoId)
  }

  function onSubmitError(current, e) {
    // Doble clic o reenvío: el segundo recibe 409 INTENTO_YA_ENVIADO. NO es un error: se va a la revisión.
    if (e?.codigo === 'INTENTO_YA_ENVIADO') return finish(current, null)

    // Intento vencido / diagnóstico ya presentado / intento ajeno: no hay nada que reintentar.
    if (FINAL_ERRORS.includes(e?.codigo)) {
      examStorage.clearAnswers(current.intentoId)
      leave()
      error.value = e
      onFinished?.()
      return
    }

    // Red, 5xx, sesión vencida o un 400 de formato: se conservan las marcas y se vuelve al examen para reintentar.
    // Un 400 indica un bug del cliente (ids mezclados): solo se registra el código, no el cuerpo.
    if (e?.status === 400) console.error('[examen] envío rechazado:', e.codigo || 'validación')
    error.value = e
    phase.value = 'taking'
    startTimer()
  }

  /* ───────────── Revisión ───────────── */
  async function loadReview(id = reviewId) {
    if (id == null) return
    const g = gen
    reviewId = id
    reviewState.value = 'loading'
    reviewError.value = null
    try {
      const data = await examService.getReview(id)
      if (g !== gen) return
      review.value = data
      summary.value = { puntaje: data.puntaje, aciertos: data.aciertos, total: data.total }
      reviewState.value = 'ready'
    } catch (e) {
      if (g !== gen) return
      reviewError.value = e
      reviewState.value = 'error'
    }
  }
  const retryReview = () => loadReview(reviewId)

  // Abrir la revisión de un intento ya enviado (desde la tarjeta del examen).
  function openReview(exam, attemptId) {
    if (active.value || starting.value !== null) return
    leave()
    meta.value = { codigo: exam.codigo, tipo: exam.tipo, modulo: exam.modulo }
    phase.value = 'result'
    loadReview(attemptId)
  }

  const close = () => {
    leave()
    error.value = null
  }

  onBeforeUnmount(() => {
    stopTimer()
    guardUnload(false)
  })

  return {
    phase, active, starting, attempt, meta, index, answers, answeredCount, total, remainingMs,
    error, summary, review, reviewState, reviewError,
    start, choose, clearChoice, goTo, submit, openReview, retryReview, close,
  }
}
