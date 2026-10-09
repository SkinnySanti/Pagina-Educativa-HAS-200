import { computed } from 'vue'
import { useAuth } from './useAuth.js'
import { MODULE1_STEPS, MODULE2_STEPS, useGuideProgress } from './useGuideProgress.js'

// Opciones de la página: 0 = Evaluación diagnóstica, 1 = Examen post recorrido.
// Módulos (cada opción tiene un examen por módulo): 0 = Módulo 1, 1 = Módulo 2.
export const OPTION_DIAGNOSTIC = 0
export const OPTION_POST = 1

// Estado de un examen:
//   'login'     → no hay sesión (solo se ve; para presentarlo hay que iniciar sesión)
//   'locked'    → hay sesión, pero falta terminar la guía de ese módulo (solo post recorrido)
//   'available' → se puede presentar
export function useExamAccess() {
  const { isLoggedIn } = useAuth()
  const m1 = useGuideProgress('m1', MODULE1_STEPS)
  const m2 = useGuideProgress('m2', MODULE2_STEPS)

  // Avance de las guías por módulo. El Módulo 2 aún no tiene guía: queda siempre incompleto.
  const guides = computed(() => [
    { done: m1.complete.value, count: m1.count.value, total: MODULE1_STEPS },
    { done: m2.complete.value, count: m2.count.value, total: MODULE2_STEPS },
  ])

  function statusOf(option, mod) {
    if (!isLoggedIn.value) return 'login'
    if (option === OPTION_DIAGNOSTIC) return 'available' // se presenta ANTES de las guías
    return guides.value[mod].done ? 'available' : 'locked'
  }

  // Estado de una opción completa: disponible si alguno de sus 2 exámenes lo está.
  function optionStatus(option) {
    if ([0, 1].some((mod) => statusOf(option, mod) === 'available')) return 'available'
    return isLoggedIn.value ? 'locked' : 'login'
  }

  // Exámenes ya presentados ("opción-módulo"). Pendiente: cuando el backend tenga el endpoint
  // de intentos/resultados, se llena desde aquí. Mientras tanto siempre está vacío (0/4).
  const completed = computed(() => new Set())
  const isCompleted = (option, mod) => completed.value.has(`${option}-${mod}`)

  return { isLoggedIn, guides, statusOf, optionStatus, isCompleted, completedCount: computed(() => completed.value.size) }
}
