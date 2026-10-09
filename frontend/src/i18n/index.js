import { ref, computed, watch } from 'vue'
import es from './inicio.es.js'
import en from './inicio.en.js'

const messages = { es, en }
const STORAGE_KEY = 'has200-lang'

function readSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

// Estado global: todos los componentes comparten el mismo idioma.
const lang = ref(readSaved() === 'en' ? 'en' : 'es')

watch(
  lang,
  (value) => {
    document.documentElement.lang = value
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* si el navegador bloquea el almacenamiento, no pasa nada */
    }
  },
  { immediate: true },
)

export function useI18n() {
  const t = computed(() => messages[lang.value])
  const setLang = (value) => {
    if (value in messages) lang.value = value
  }
  return { lang, t, setLang }
}
