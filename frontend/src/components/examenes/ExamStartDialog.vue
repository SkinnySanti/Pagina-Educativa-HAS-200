<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../i18n'

// Confirmación antes de comenzar un examen (<dialog> nativo: el foco queda dentro y Esc la cierra).
defineProps({ name: { type: String, default: '' } })
const emit = defineEmits(['confirm'])
const { t } = useI18n()
const d = computed(() => t.value.examenes.dialog)
const dlg = ref(null)
defineExpose({ open: () => dlg.value?.showModal() })
const onBackdrop = (e) => e.target === dlg.value && dlg.value.close()
function confirm() {
  dlg.value.close()
  emit('confirm')
}
</script>

<template>
  <dialog ref="dlg" aria-labelledby="exam-dlg-title" @click="onBackdrop">
    <h3 id="exam-dlg-title">{{ d.title }}</h3>
    <p>{{ d.text(name) }}</p>
    <div class="acts">
      <button type="button" class="btn btn-ghost" @click="dlg.close()">{{ d.cancel }}</button>
      <button type="button" class="btn btn-primary" @click="confirm">{{ d.confirm }}</button>
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
.acts { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
</style>
