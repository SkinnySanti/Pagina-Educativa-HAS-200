<script setup>
import { computed } from 'vue'

// Dona de una habilidad. El número y el "%" van juntos, centrados dentro del círculo.
// level: 'f' (Fortaleza) | 'p' (En progreso) | 'r' (A reforzar) | 'n' (sin datos)
const props = defineProps({
  value: { type: Number, default: null }, // 0-100, o null si todavía no hay datos
  level: { type: String, default: 'n' },
  label: { type: String, default: '' }, // texto para lectores de pantalla
})
const R = 40
const C = 2 * Math.PI * R
const dash = computed(() => `${(C * (props.value ?? 0)) / 100} ${C}`)
</script>

<template>
  <div class="re-donut" role="img" :aria-label="label">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle class="track" cx="50" cy="50" :r="R" />
      <circle class="arc" :class="level" cx="50" cy="50" :r="R" :stroke-dasharray="dash" />
    </svg>
    <div class="pct" aria-hidden="true">
      <span v-if="value !== null"><b>{{ value }}</b><small>%</small></span>
      <span v-else><b>—</b></span>
    </div>
  </div>
</template>
