// Cliente HTTP del backend: adjunta el token, renueva la sesión cuando vence y
// traduce los errores (Problem Details) a un ApiError. Contrato: README_ENDPOINTS.md.
import { API_BASE_URL, AUTH_ENDPOINTS, REFRESH_MARGIN_MS } from '../config/api.js'
import * as storage from './authStorage.js'

// code: 'network' | 'invalid' | 'conflict' | 'validation' | 'rate' | 'session' | 'server'
// (la interfaz lo traduce con i18n/auth.*.js → server)
export class ApiError extends Error {
  constructor(status, { detail = '', fields = null, retryAfter = null, code } = {}) {
    super(detail || `HTTP ${status}`)
    this.status = status
    this.detail = detail
    this.fields = fields // { correo: '...', alias: '...' } en los 400 de validación
    this.retryAfter = retryAfter // segundos, si llega 429 con Retry-After
    this.code = code || codeFor(status)
  }
}

function codeFor(status) {
  if (status === 0) return 'network'
  if (status === 401) return 'session' // en login se reinterpreta como 'invalid' (ver authService)
  if (status === 409) return 'conflict'
  if (status === 400 || status === 422) return 'validation'
  if (status === 429) return 'rate'
  return 'server'
}

// La app se entera de que la sesión murió (refresh fallido) sin importar useAuth (evita ciclos).
let onSessionExpired = () => {}
export const setSessionExpiredHandler = (fn) => (onSessionExpired = fn)

async function toApiError(res) {
  let problem = null
  try {
    problem = await res.json()
  } catch {
    /* sin cuerpo o no es JSON */
  }
  const retry = Number(res.headers.get('Retry-After'))
  return new ApiError(res.status, {
    detail: problem?.detail || '',
    fields: problem?.errores && typeof problem.errores === 'object' ? problem.errores : null,
    retryAfter: Number.isFinite(retry) && retry > 0 ? retry : null,
  })
}

async function rawFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  try {
    return await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0) // sin conexión, servidor caído o CORS bloqueado
  }
}

async function readJson(res) {
  if (res.status === 204) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}

/* ───────────── Renovación de sesión (un solo refresh a la vez) ───────────── */

let refreshing = null // promesa compartida: si varias peticiones reciben 401, esperan LA MISMA

async function doRefresh() {
  const used = storage.getRefreshToken()
  if (!used) throw new ApiError(401, { code: 'session' })

  const run = async () => {
    // Otra pestaña pudo renovar mientras esperábamos el candado: ya hay un par nuevo guardado.
    if (storage.getRefreshToken() !== used) return
    const res = await rawFetch(AUTH_ENDPOINTS.refresh, { method: 'POST', body: { tokenRefresco: used } })
    if (res.ok) {
      storage.saveTokens(await readJson(res)) // reemplaza los DOS tokens antes de cualquier otra cosa
      return
    }
    const err = await toApiError(res)
    if (res.status === 400 || res.status === 401) {
      // Refresco inválido, vencido o reutilizado: la sesión ya no sirve.
      storage.clearTokens()
      onSessionExpired()
      throw new ApiError(401, { detail: err.detail, code: 'session' })
    }
    throw err // 5xx u otro: no se cierra la sesión, se puede reintentar
  }

  // Web Locks evita que dos pestañas refresquen a la vez (la reutilización cerraría la sesión).
  if (typeof navigator !== 'undefined' && navigator.locks?.request) {
    return navigator.locks.request('has200-refresh', run)
  }
  return run()
}

export function refreshSession() {
  if (!refreshing) refreshing = doRefresh().finally(() => (refreshing = null))
  return refreshing
}

/* ───────────── Petición pública y protegida ───────────── */

// auth: true  → ruta protegida (Bearer + renovación + un reintento tras 401)
// auth: false → ruta pública (/api/auth/*): nunca se reintenta (evita bucles)
export async function request(path, { method = 'GET', body, auth = true } = {}) {
  if (!auth) {
    const res = await rawFetch(path, { method, body })
    if (!res.ok) throw await toApiError(res)
    return readJson(res)
  }

  if (!storage.hasSession()) throw new ApiError(401, { code: 'session' })
  // Renovación preventiva de último momento: si ya venció (o falta <60 s), se renueva antes de enviar.
  if (storage.isAccessExpired(REFRESH_MARGIN_MS)) await refreshSession()

  let res = await rawFetch(path, { method, body, token: storage.getAccessToken() })
  if (res.status === 401) {
    await refreshSession() // si falla, lanza ApiError('session') y la sesión queda limpia
    res = await rawFetch(path, { method, body, token: storage.getAccessToken() }) // un solo reintento
  }
  if (!res.ok) throw await toApiError(res)
  return readJson(res)
}
