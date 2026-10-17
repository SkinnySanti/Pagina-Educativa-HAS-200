<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../i18n'

// Confirmación antes de reiniciar el avance de una guía (DELETE /api/me/progress/{modulo}, CONTEXTO v1.1 §10.5).
// Se queda abierta mientras la petición está en vuelo y muestra el error si el servidor no confirma.
const props = defineProps({
  module: { type: String, default: 'm1' },
  busy: Boolean,
  error: { type: String, default: '' },
})
const emit = defineEmits(['confirm'])
const { t } = useI18n()
const r = computed(() => t.value.guias.sync.reset)
const dlg = ref(null)
defineExpose({ open: () => dlg.value?.showModal(), close: () => dlg.value?.close() })
const onBackdrop = (e) => e.target === dlg.value && !props.busy && dlg.value.close()
const onCancel = (e) => props.busy && e.preventDefault() // Esc no cierra mientras se reinicia
</script>

<template>
  <dialog ref="dlg" aria-labelledby="guide-reset-title" @click="onBackdrop" @cancel="onCancel">
    <h3 id="guide-reset-title">{{ r.title }}</h3>
    <p>{{ r.text(module === 'm2' ? 2 : 1) }}</p>
    <p v-if="error" class="err" role="alert">{{ error }}</p>
    <div class="acts">
      <button type="button" class="btn btn-ghost" :disabled="busy" @click="dlg.close()">{{ r.cancel }}</button>
      <button type="button" class="btn btn-danger" :disabled="busy" :aria-busy="busy" @click="emit('confirm')">
        {{ busy ? r.working : r.confirm }}
      </button>
    </div>
  </dialog>
</template>

<style scoped>
dialog {
  border: 0; border-radius: var(--radius-lg); padding: 26px 28px;
  max-width: 480px; width: calc(100% - 32px);
  background: var(--surface); color: var(--ink); box-shadow: var(--shadow-overlay);
}
dialog::backdrop { background: var(--overlay); }
h3 { font-size: 20px; margin-bottom: 8px; }
p { color: var(--ink-2); font-size: 14.5px; margin-bottom: 16px; }
.err { padding: 10px 12px; border-radius: 12px; background: var(--danger-tint); color: var(--danger); font-weight: 600; }
.acts { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
</style>
