import { computed, ref } from 'vue'
import * as authService from '../services/authService.js'
import * as storage from '../services/authStorage.js'
import { refreshSession, setSessionExpiredHandler } from '../services/apiClient.js'
import { REFRESH_MARGIN_MS } from '../config/api.js'

// Sesión compartida por toda la app (misma instancia en barra superior, router y formularios).
// Solo guardamos el perfil en memoria: los tokens están en authStorage y el perfil sale de /api/me.
const user = ref(null) // { id, correo, alias, creadoEn } | null
let timer = null

function clearTimer() {
  if (timer) clearTimeout(timer)
  timer = null
}

// Renovación preventiva: ~60 s antes de que venza el token de acceso.
function scheduleRefresh() {
  clearTimer()
  if (!storage.hasSession()) return
  const delay = Math.max(storage.getAccessExpiresAt() - Date.now() - REFRESH_MARGIN_MS, 0)
  timer = setTimeout(async () => {
    try {
      await refreshSession()
      scheduleRefresh()
    } catch (e) {
      // 'session' ya limpió todo (ver handler). Si fue un fallo de red, se reintenta en 30 s.
      if (e.code !== 'session' && storage.hasSession()) timer = setTimeout(scheduleRefresh, 30_000)
    }
  }, delay)
}

function dropSession() {
  clearTimer()
  user.value = null
}

// Si el refresh falla (inválido/vencido/reutilizado), apiClient ya borró los tokens: solo limpiamos la UI.
setSessionExpiredHandler(dropSession)

// Otra pestaña inició/cerró sesión o renovó tokens: este módulo se sincroniza.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', async (e) => {
    if (!storage.isSessionKey(e.key)) return
    if (!storage.hasSession()) return dropSession()
    if (!user.value) {
      try {
        user.value = await authService.fetchMe()
      } catch {
        return
      }
    }
    scheduleRefresh()
  })
}

// Arranque: lee localStorage; si hay sesión (vigente o renovable), carga el perfil.
// El guard del router ESPERA a esta promesa antes de decidir si una ruta es accesible.
async function init() {
  if (!storage.hasSession()) return
  try {
    user.value = await authService.fetchMe() // apiClient renueva solo si hace falta
    scheduleRefresh()
  } catch (e) {
    // 'session': tokens ya borrados → anónimo. 'network'/'server': se conservan los tokens (no se pierde la sesión).
    user.value = null
  }
}
export const authReady = init()

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value)
  const alias = computed(() => user.value?.alias || user.value?.correo || '')

  // Login: guarda tokens y carga el perfil.
  async function login(credentials) {
    await authService.login(credentials)
    try {
      user.value = await authService.fetchMe()
    } catch (e) {
      await authService.logout() // no dejar tokens huérfanos si el perfil falló
      throw e
    }
    scheduleRefresh()
    return user.value
  }

  // Registro: crea la cuenta pero NO inicia sesión (el backend no devuelve tokens).
  const register = (data) => authService.register(data)

  async function logout() {
    dropSession() // la interfaz cambia al instante
    await authService.logout()
  }

  return { user, isLoggedIn, alias, ready: authReady, login, register, logout }
}
