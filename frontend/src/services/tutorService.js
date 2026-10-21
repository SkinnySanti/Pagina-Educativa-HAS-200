// Llamada al Tutor virtual. Usa el mismo cliente que el resto de la app (token, renovación de sesión y errores).
import { TUTOR_ENDPOINT } from '../config/api.js'
import { request } from './apiClient.js'

/** POST /api/tutor/chat → { respuesta, restantesHoy } */
export const askTutor = ({ mensaje, historial, idioma }) =>
  request(TUTOR_ENDPOINT, { method: 'POST', body: { mensaje, historial, idioma } })
