import { ref, watch } from 'vue'
import { askTutor } from '../services/tutorService.js'
import { useAuth } from './useAuth.js'
import { useI18n } from '../i18n'

// Estado COMPARTIDO del chat: si el estudiante cambia de página y vuelve, la conversación sigue ahí.
// Solo vive en memoria (no se guarda en el navegador) y se borra al cerrar sesión: en los computadores
// compartidos del colegio no debe quedar la conversación de otra persona.
const messages = ref([]) // { id, role: 'user' | 'assistant', content }
const sending = ref(false)
const errorKey = ref('') // clave dentro de t.tutor.errors
const remaining = ref(null) // preguntas que le quedan hoy (lo informa el backend)
let seq = 0

const { isLoggedIn } = useAuth()
watch(isLoggedIn, (ok) => {
  if (!ok) reset()
})

function reset() {
  messages.value = []
  errorKey.value = ''
  remaining.value = null
  sending.value = false
}

// El backend decide por `codigo` (negocio) y `code` (tipo de fallo HTTP).
function errorKeyFor(e) {
  switch (e?.codigo) {
    case 'TUTOR_LIMITE_USUARIO': return 'dayLimit'
    case 'TUTOR_LIMITE_RITMO': return 'slowDown'
    case 'TUTOR_LIMITE_GLOBAL': return 'busy'
    case 'TUTOR_NO_DISPONIBLE': return 'unavailable'
  }
  if (e?.code === 'network') return 'network'
  if (e?.code === 'session') return 'session'
  if (e?.code === 'validation') return 'invalid'
  return 'generic'
}

export function useTutorChat() {
  const { lang } = useI18n()

  /** Envía una pregunta. Devuelve true si el tutor respondió; false si falló (la pregunta no queda en el chat). */
  async function send(raw) {
    const text = (raw || '').trim()
    if (!text || sending.value) return false
    errorKey.value = ''

    // El historial se arma ANTES de agregar la pregunta nueva (el backend la recibe aparte en `mensaje`).
    const historial = messages.value.slice(-12).map((m) => ({ rol: m.role, contenido: m.content.slice(0, 1500) }))
    const mine = { id: ++seq, role: 'user', content: text }
    messages.value.push(mine)
    sending.value = true
    try {
      const { respuesta, restantesHoy } = await askTutor({ mensaje: text, historial, idioma: lang.value })
      messages.value.push({ id: ++seq, role: 'assistant', content: respuesta })
      remaining.value = restantesHoy
      return true
    } catch (e) {
      messages.value = messages.value.filter((m) => m.id !== mine.id)
      errorKey.value = errorKeyFor(e)
      return false
    } finally {
      sending.value = false
    }
  }

  return { messages, sending, errorKey, remaining, send, reset }
}
