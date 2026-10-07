// Validadores del formulario de acceso. Devuelven la CLAVE del error (se traduce en i18n/auth.*.js → errors)
// o '' si el valor es válido. Reglas alineadas con el backend (README_ENDPOINTS.md, sección 8).
const RE_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const RE_ALIAS = /^[A-Za-z0-9_]{3,20}$/ // igual que el backend: sin tildes, sin ñ y sin punto

export const vRequired = (v) => (v ? '' : 'req')
export const vEmail = (v) => (!v ? 'req' : v.length <= 255 && RE_MAIL.test(v) ? '' : 'email')
export const vAlias = (v) => (!v ? 'req' : RE_ALIAS.test(v) ? '' : 'alias')
export const vNewPassword = (v) =>
  !v ? 'req' : v.length < 8 ? 'passMin' : v.length > 64 ? 'passMax' : /[A-Za-z]/.test(v) && /\d/.test(v) ? '' : 'passMix'
