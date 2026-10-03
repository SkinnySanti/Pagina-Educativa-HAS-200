import { ref, watch } from 'vue'

const STORAGE_KEY = 'has200-theme'

function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function readSaved() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    /* almacenamiento bloqueado */
  }
  return null
}

function apply(theme) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#163a78' : '#1B4F9C')
}

const saved = readSaved()
const theme = ref(saved || systemTheme())
apply(theme.value)

if (!saved) {
  try {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener('change', (event) => {
      if (readSaved()) return
      theme.value = event.matches ? 'dark' : 'light'
    })
  } catch {
    /* matchMedia no disponible */
  }
}

watch(theme, apply)

export function useTheme() {
  const setTheme = (value) => {
    if (value !== 'light' && value !== 'dark') return
    theme.value = value
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* si el navegador bloquea el almacenamiento, no pasa nada */
    }
  }

  return { theme, setTheme }
}
