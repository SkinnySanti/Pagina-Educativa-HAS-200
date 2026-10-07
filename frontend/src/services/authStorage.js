// ÚNICO módulo que toca los tokens en localStorage (README_ENDPOINTS.md, sección 7).
// Cuando el refresco pase a una cookie HttpOnly, el cambio queda solo aquí.
import { STORAGE_KEYS } from '../config/api.js'

const LEGACY_KEY = 'has200-auth' // sesión simulada de la versión anterior (mock)

function get(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const getAccessToken = () => get(STORAGE_KEYS.access)
export const getRefreshToken = () => get(STORAGE_KEYS.refresh)

export function getAccessExpiresAt() {
  const n = Number(get(STORAGE_KEYS.accessExpiresAt))
  return Number.isFinite(n) ? n : 0
}

// ¿El token de acceso ya venció (o está por vencer)? marginMs = margen de seguridad.
export const isAccessExpired = (marginMs = 0) => !getAccessToken() || Date.now() >= getAccessExpiresAt() - marginMs

export const hasSession = () => !!getRefreshToken()

// Guarda el par completo que devuelven login y refresh. Reemplaza los DOS tokens.
export function saveTokens(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.access, data.tokenAcceso)
    localStorage.setItem(STORAGE_KEYS.refresh, data.tokenRefresco)
    localStorage.setItem(STORAGE_KEYS.accessExpiresAt, String(Date.now() + data.expiraEnSegundos * 1000))
  } catch {
    /* si el navegador bloquea el almacenamiento, la sesión no podrá mantenerse */
  }
}

export function clearTokens() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* ignorar */
  }
}

// ¿Esta clave de localStorage es una de las de sesión? (para el evento "storage" entre pestañas)
export const isSessionKey = (key) => key === null || Object.values(STORAGE_KEYS).includes(key)
