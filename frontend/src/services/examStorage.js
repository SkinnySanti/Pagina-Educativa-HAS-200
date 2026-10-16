// ÚNICO módulo que toca localStorage para los exámenes (CONTEXTO_FRONTEND_EXAMENES §9.2).
// El servidor NO guarda respuestas parciales: las marcas viven aquí hasta que el envío da 200.
const PREFIX = 'has200.exam.'

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* si el navegador bloquea el almacenamiento, las marcas duran solo mientras no se recargue */
  }
}
function remove(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* ignorar */
  }
}

/** Marcas del intento en curso: { [preguntaId]: opcionId }. Clave: has200.exam.<intentoId>. */
export function loadAnswers(attemptId) {
  try {
    const raw = JSON.parse(read(PREFIX + attemptId) || '{}')
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  } catch {
    return {}
  }
}
export const saveAnswers = (attemptId, answers) => write(PREFIX + attemptId, JSON.stringify(answers))
export const clearAnswers = (attemptId) => remove(PREFIX + attemptId)

// PARCHE TEMPORAL (§11): sin GET /api/me/attempts no hay forma de saber el id del último intento enviado.
// Se guarda por estudiante y examen para poder abrir la revisión después de recargar.
const lastKey = (userId, codigo) => `${PREFIX}last.${userId}.${codigo}`
export function getLastAttempt(userId, codigo) {
  const n = Number(read(lastKey(userId, codigo)))
  return Number.isInteger(n) && n > 0 ? n : null
}
export const setLastAttempt = (userId, codigo, attemptId) => write(lastKey(userId, codigo), String(attemptId))
