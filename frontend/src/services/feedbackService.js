// Llamadas de la página de Retroalimentación. Las URLs viven en src/config/api.js.
// normalize() es el ÚNICO lugar que conoce la forma del JSON del servidor: si el contrato cambia, se ajusta aquí
// y el resto de la página (utils/feedbackStats.js y los componentes) no se entera.
import { FEEDBACK_ENDPOINTS } from '../config/api.js'
import { ApiError, request } from './apiClient.js'
import { FEEDBACK_SAMPLE } from './feedbackSample.js'

const SKILLS = ['INGLES', 'FUNCIONAMIENTO', 'TERMINOS_TECNICOS', 'PENSAMIENTO_SISTEMICO']
const pair = (h) => (h && Number.isFinite(h.total) && h.total > 0 ? [h.aciertos ?? 0, h.total] : null)

function side(x) {
  return x ? { id: x.intentoId ?? null, puntaje: x.puntaje ?? 0 } : null
}

export function normalize(rawAttempts, rawFeedback) {
  const attempts = (Array.isArray(rawAttempts) ? rawAttempts : []).map((a) => ({
    id: a.id,
    modulo: a.modulo,
    tipo: a.tipo,
    estado: a.estado,
    puntaje: a.puntaje ?? null,
    aciertos: a.aciertos ?? null,
    total: a.total ?? 10,
    segundos: a.segundos ?? null,
    fecha: a.fecha,
  }))

  const compare = {}
  const errors = []
  for (const m of rawFeedback?.modulos ?? []) {
    const skills = {}
    for (const k of SKILLS) {
      skills[k] = { diag: pair(m.diagnostico?.habilidades?.[k]), post: pair(m.post?.habilidades?.[k]) }
    }
    compare[m.modulo] = { diag: side(m.diagnostico), post: side(m.post), skills }
    for (const e of m.errores ?? []) {
      errors.push({
        modulo: m.modulo,
        habilidad: e.habilidad,
        concepto: e.concepto,
        ref: e.referenciaModulo,
        idioma: e.idioma ?? 'es',
        enunciado: e.enunciado,
        marcada: e.opcionMarcada?.texto ?? null, // null = sin responder
        correcta: e.opcionCorrecta?.texto ?? '',
        explicacion: e.explicacion ?? '',
      })
    }
  }
  return { attempts, compare, errors }
}

/** Carga los intentos y la retroalimentación del estudiante. Devuelve { data, sample }. */
export async function loadFeedback() {
  try {
    const [attempts, feedback] = await Promise.all([
      request(FEEDBACK_ENDPOINTS.attempts),
      request(FEEDBACK_ENDPOINTS.feedback),
    ])
    return { data: normalize(attempts, feedback), sample: false }
  } catch (e) {
    // Solo en desarrollo: si el backend aún no tiene estos endpoints, se muestra la maqueta con datos de ejemplo
    // (y la página lo avisa con un cartel). En producción el error llega a la pantalla tal cual.
    if (import.meta.env.DEV && e instanceof ApiError && (e.status === 404 || e.status === 405)) {
      console.warn('[retroalimentación] El servidor no expone /api/me/attempts ni /api/me/feedback: datos de ejemplo.')
      return { data: FEEDBACK_SAMPLE, sample: true }
    }
    throw e
  }
}
