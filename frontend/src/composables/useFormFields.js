import { computed, reactive } from 'vue'

// Estado y validación de un formulario.
//   defs: { campo: { validate: (valor, todos) => claveDeError | '', trim: true } }
// Un campo muestra su error solo después de tocarlo (al salir de él con texto) o de enviar.
export function useFormFields(defs) {
  const keys = Object.keys(defs)
  const values = reactive(Object.fromEntries(keys.map((k) => [k, ''])))
  const touched = reactive(Object.fromEntries(keys.map((k) => [k, false])))

  const clean = (k) => (defs[k].trim === false ? values[k] : values[k].trim())
  const errors = computed(() => {
    const all = Object.fromEntries(keys.map((k) => [k, clean(k)]))
    return Object.fromEntries(keys.map((k) => [k, defs[k].validate(all[k], all)]))
  })

  const visibleError = (k) => (touched[k] ? errors.value[k] : '')
  const isValid = (k) => touched[k] && !errors.value[k] && values[k] !== ''
  const touch = (k) => {
    if (values[k]) touched[k] = true
  }
  function validateAll() {
    keys.forEach((k) => (touched[k] = true))
    return keys.every((k) => !errors.value[k])
  }

  return { values, visibleError, isValid, touch, validateAll, clean }
}
