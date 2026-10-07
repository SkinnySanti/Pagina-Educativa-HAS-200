// Llamadas de autenticación al backend (README_ENDPOINTS.md, sección 3).
// Las URLs viven en src/config/api.js; el manejo de tokens, en authStorage.js y apiClient.js.
import { AUTH_ENDPOINTS } from '../config/api.js'
import { ApiError, request } from './apiClient.js'
import * as storage from './authStorage.js'

// Mensajes de 409 que identifican el campo (README sección 4). El mensaje ambiguo
// ("El correo o el alias ya están en uso") NO se asocia a ningún campo a propósito.
const CONFLICT_FIELD = {
  'El correo ya está registrado': 'email',
  'El alias ya está en uso': 'alias',
}

/** POST registro → estudiante { id, correo, alias, creadoEn }. NO inicia sesión. */
export async function register({ email, alias, password, policyAccepted }) {
  try {
    return await request(AUTH_ENDPOINTS.register, {
      method: 'POST',
      auth: false,
      body: { correo: email, alias, contrasena: password, politicaAceptada: policyAccepted },
    })
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) e.conflictField = CONFLICT_FIELD[e.detail] || null
    throw e
  }
}

/** POST login → guarda los tokens. Después hay que pedir el perfil con fetchMe(). */
export async function login({ email, password }) {
  try {
    const data = await request(AUTH_ENDPOINTS.login, {
      method: 'POST',
      auth: false,
      // El backend guarda el correo en minúsculas; se envía igual para evitar fallos por mayúsculas.
      body: { correo: email.trim().toLowerCase(), contrasena: password },
    })
    storage.saveTokens(data)
  } catch (e) {
    // En login, 401 = credenciales inválidas (mismo mensaje para correo o contraseña mala).
    if (e instanceof ApiError && e.status === 401) throw new ApiError(401, { detail: e.detail, code: 'invalid' })
    throw e
  }
}

/** GET /api/me → { id, correo, alias, creadoEn }. Los datos se leen siempre del servidor. */
export const fetchMe = () => request(AUTH_ENDPOINTS.me)

/** Cierra la sesión: borra los tokens locales SIEMPRE, aunque el servidor falle. */
export async function logout() {
  const tokenRefresco = storage.getRefreshToken()
  storage.clearTokens()
  if (!tokenRefresco) return
  try {
    await request(AUTH_ENDPOINTS.logout, { method: 'POST', auth: false, body: { tokenRefresco } })
  } catch {
    /* logout es idempotente; si falla (red, 401…) la sesión local ya está limpia */
  }
}
