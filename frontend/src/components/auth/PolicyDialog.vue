<script setup>
import { computed, ref } from 'vue'
import { useI18n } from '../../i18n'

// Ventana con la política de datos (<dialog> nativo: el foco queda dentro y Esc la cierra).
const { t } = useI18n()
const p = computed(() => t.value.auth.policy)
const dlg = ref(null)
defineExpose({ open: () => dlg.value?.showModal() })
// Clic en el fondo oscuro (fuera de la tarjeta) también la cierra.
const onClick = (e) => e.target === dlg.value && dlg.value.close()
</script>

<template>
  <dialog ref="dlg" aria-labelledby="policy-title" @click="onClick">
    <h3 id="policy-title">{{ p.title }}</h3>
    <p>{{ p.text }}</p>
    <button class="btn btn-primary" type="button" @click="dlg.close()">{{ p.close }}</button>
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
</style>
