<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { mmss, signed } from '../../utils/feedbackStats.js'

// Las 4 tarjetas de estadísticas. Ocupan TODO el ancho de la página (alineadas con el Hero);
// el lateral y las secciones van debajo de ellas.
const props = defineProps({ stats: { type: Object, required: true } })
const { t } = useI18n()
const k = computed(() => t.value.retro.kpis)
const mod = (n) => t.value.retro.module(n)

const items = computed(() => {
  const s = props.stats
  const gainList = s.mejoras.map((d) => ({ modulo: d.modulo, sign: signed(d.delta) }))
  return [
    { icon: 'clipboard', label: k.value.attempts.label, value: String(s.intentos), sub: k.value.attempts.sub(s.vencidos) },
    { icon: 'star', label: k.value.best.label, value: s.intentos ? String(s.mejor) : '—', unit: s.intentos ? '%' : '', sub: k.value.best.sub },
    {
      icon: 'chart', label: k.value.gain.label, good: s.mejora !== null && s.mejora > 0,
      value: s.mejora === null ? '—' : signed(s.mejora), unit: s.mejora === null ? '' : k.value.gain.unit,
      sub: k.value.gain.sub(gainList, mod),
    },
    { icon: 'clock', label: k.value.time.label, value: s.tiempo === null ? '—' : mmss(s.tiempo), unit: s.tiempo === null ? '' : k.value.time.unit, sub: k.value.time.sub },
  ]
})
</script>

<template>
  <ul class="re-kpis" :aria-label="k.label">
    <li v-for="i in items" :key="i.label" class="card re-kpi">
      <span class="re-ico"><AppIcon :name="i.icon" :size="22" /></span>
      <span class="lbl">{{ i.label }}</span>
      <span class="val" :class="{ good: i.good }">{{ i.value }}<small v-if="i.unit">{{ i.unit }}</small></span>
      <span class="sub">{{ i.sub }}</span>
    </li>
  </ul>
</template>
