import { onBeforeUnmount, ref } from 'vue'

// Detecta una petición "lenta" para avisar al usuario (p. ej. el arranque en frío de Render:
// tras un rato sin uso, la primera petición puede tardar de segundos a minutos).
//   const { slow, run } = useSlowHint(3000)
//   await run(() => login(...))   // `slow` pasa a true si la petición sigue en curso tras 3 s
// No cancela ni limita la petición: solo mide el tiempo. Se limpia al terminar o al desmontar.
export function useSlowHint(delayMs = 3000) {
  const slow = ref(false)
  let timer = null

  const stop = () => {
    clearTimeout(timer)
    timer = null
    slow.value = false
  }

  async function run(task) {
    stop()
    timer = setTimeout(() => (slow.value = true), delayMs)
    try {
      return await task()
    } finally {
      stop()
    }
  }

  onBeforeUnmount(stop)
  return { slow, run }
}
