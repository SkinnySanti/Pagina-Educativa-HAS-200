// Llamadas del módulo de exámenes (CONTEXTO_FRONTEND_EXAMENES §4–§7).
// Las URLs viven en src/config/api.js; la sesión y los errores, en apiClient.js.
import { EXAM_ENDPOINTS } from '../config/api.js'
import { request } from './apiClient.js'

/** GET /api/exams → los 4 exámenes con su `estado` (DISPONIBLE | BLOQUEADO_GUIA | USADO). */
export const listExams = () => request(EXAM_ENDPOINTS.list)

/**
 * POST /api/exams/{id}/attempts → 201 (nuevo) o 200 (reanudado).
 * Agrega `skewMs` = hora del servidor − hora del cliente, para que el cronómetro cuente hacia `venceEn`
 * aunque el reloj del equipo esté desfasado (§9.3). Si el navegador no expone la cabecera Date
 * (CORS sin Access-Control-Expose-Headers), el desfase queda en 0 y el servidor igual decide al enviar.
 */
export async function startAttempt(examId) {
  const { data, serverDate } = await request(EXAM_ENDPOINTS.start(examId), { method: 'POST', raw: true })
  const serverMs = Date.parse(serverDate)
  let skewMs = Number.isFinite(serverMs) ? serverMs - Date.now() : 0
  if (Math.abs(skewMs) < 2000) skewMs = 0 // la cabecera Date tiene resolución de 1 s: no es desfase real
  return { ...data, skewMs }
}

/** POST /api/exams/{id}/submit → { intentoId, estado, aciertos, total, puntaje, enviadoEn }. */
export const submitAttempt = (attemptId, respuestas) =>
  request(EXAM_ENDPOINTS.submit(attemptId), { method: 'POST', body: { respuestas } })

/** GET /api/attempts/{id}/review → { intentoId, puntaje, aciertos, total, errores: [...] }. */
export const getReview = (attemptId) => request(EXAM_ENDPOINTS.review(attemptId))
