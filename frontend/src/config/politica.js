// Política de tratamiento de datos personales de la Universidad de Cundinamarca.
//
// ► AQUÍ VA EL LINK DE REDIRECCIONAMIENTO: pega la URL completa (https://…) en POLICY_URL.
//   Al hacer clic en «Política de Tratamiento de Datos Personales» (registro), PolicyDialog.vue muestra
//   un aviso con cuenta regresiva y, al terminar, abre esta URL en una pestaña nueva.
//   Mientras esté vacía, al terminar la cuenta se muestra el aviso «enlace pendiente».
export const POLICY_URL = 'https://www.ucundinamarca.edu.co/proteccion-de-datos-personales'

// Segundos que dura la cuenta regresiva antes de abrir la pestaña (4 o 5; con 4 hay menos riesgo de que
// el navegador bloquee la apertura automática, porque Chrome solo la permite poco después del clic).
export const POLICY_DELAY_SECONDS = 4

// Solo se abren enlaces https; si alguien pega otra cosa por error, no se abre.
export function safePolicyUrl(url = POLICY_URL) {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' ? u.href : ''
  } catch {
    return ''
  }
}
