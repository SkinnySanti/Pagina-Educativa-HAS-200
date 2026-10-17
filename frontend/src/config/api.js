// ─────────────────────────────────────────────────────────────────────────────
//  CONEXIÓN CON EL BACKEND (Spring) — AQUÍ SE CAMBIAN LAS URLS
//  Contrato completo: backend/README_ENDPOINTS.md
//  La lógica de las peticiones está en src/services/ (apiClient.js y authService.js).
// ─────────────────────────────────────────────────────────────────────────────

// URL base del servidor Spring, sin "/" al final. Se define en .env (ver .env.example):
//   VITE_API_BASE_URL=https://api.midominio.com
// Vacío = rutas relativas ("/api/..."): en desarrollo pasan por el proxy de vite.config.js
// En desarrollo déjala VACÍA).
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

// Endpoints de autenticación (README_ENDPOINTS.md, sección 3).
export const AUTH_ENDPOINTS = {
  register: '/api/auth/register', // POST  público   { correo, alias, contrasena, politicaAceptada } → 201 + estudiante
  login: '/api/auth/login',       // POST  público   { correo, contrasena } → 200 + tokens
  refresh: '/api/auth/refresh',   // POST  público   { tokenRefresco } → 200 + tokens nuevos
  logout: '/api/auth/logout',     // POST  público   { tokenRefresco } → 204
  me: '/api/me',                  // GET   protegido → 200 + estudiante
}

// Endpoints de exámenes (CONTEXTO_FRONTEND_EXAMENES_v1.md, secciones 4 a 7). Todos exigen sesión.
export const EXAM_ENDPOINTS = {
  list: '/api/exams',                                  // GET   → los 4 exámenes con su `estado`
  start: (examId) => `/api/exams/${examId}/attempts`,  // POST  → 201 (nuevo) o 200 (reanudado) + preguntas + venceEn
  submit: (attemptId) => `/api/exams/${attemptId}/submit`, // POST { respuestas } → 200 { aciertos, total, puntaje }
  review: (attemptId) => `/api/attempts/${attemptId}/review`, // GET   → errores con respuesta correcta y explicación
}

// Progreso de las guías (CONTEXTO v1.1, sección 10.5). Todas devuelven 200 con el estado completo { m1: [...], m2: [...] }.
//   GET    /api/me/progress              → estado completo
//   PUT    /api/me/progress              { modulo: 'm1', paso: 3 } → idempotente; paso en base 0 (0 a 5)
//   DELETE /api/me/progress/{modulo}     → reinicia solo ese módulo
export const PROGRESS_ENDPOINT = '/api/me/progress'

// Claves de localStorage donde se guardan los tokens (solo las toca services/authStorage.js).
export const STORAGE_KEYS = {
  access: 'has200.accessToken',
  refresh: 'has200.refreshToken',
  accessExpiresAt: 'has200.accessExpiraEn',
}

// Cuánto antes de que venza el token de acceso se renueva solo (ms). Doc: ~60 s.
export const REFRESH_MARGIN_MS = 60_000
