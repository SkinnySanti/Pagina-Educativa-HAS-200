import { computed, ref, watch } from 'vue'
import { useAuth } from './useAuth.js'
import * as feedbackService from '../services/feedbackService.js'
import { validAttempts } from '../utils/feedbackStats.js'

// Estado de la página de Retroalimentación. Reacciona a la sesión (igual que useExamAccess):
//   'idle'    → sin sesión (no se pide nada)
//   'loading' → pidiendo intentos y retroalimentación
//   'ready'   → datos cargados (puede ser que aún no haya intentos enviados: ver `empty`)
//   'error'   → falló la carga (`error` trae el ApiError)
export function useFeedback() {
  const { isLoggedIn } = useAuth()
  const state = ref('idle')
  const data = ref(null)
  const error = ref(null)
  const sample = ref(false) // true = datos de ejemplo (solo en desarrollo, ver feedbackService)
  let seq = 0

  async function reload() {
    if (!isLoggedIn.value) {
      seq++
      data.value = null
      error.value = null
      sample.value = false
      state.value = 'idle'
      return
    }
    const mine = ++seq
    if (state.value !== 'ready') state.value = 'loading' // al refrescar no se parpadea: se conserva lo que ya hay
    try {
      const res = await feedbackService.loadFeedback()
      if (mine !== seq) return
      data.value = res.data
      sample.value = res.sample
      error.value = null
      state.value = 'ready'
    } catch (e) {
      if (mine !== seq) return
      error.value = e
      if (!data.value) state.value = 'error'
    }
  }
  watch(isLoggedIn, reload, { immediate: true })

  const empty = computed(() => state.value === 'ready' && validAttempts(data.value?.attempts).length === 0)
  return { isLoggedIn, state, data, error, sample, empty, reload }
}
