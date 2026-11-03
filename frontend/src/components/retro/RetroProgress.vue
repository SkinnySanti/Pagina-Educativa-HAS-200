<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { GOAL, signed } from '../../utils/feedbackStats.js'

// Evolución de los puntajes. Un panel por módulo con columnas verticales: cada columna es UN intento enviado.
// El porcentaje va escrito encima de su columna y el nombre (Diagnóstica / Post n) con su fecha debajo, así ningún
// número se tapa ni se mueve. Diagnóstica = azul de marca; Post = verde de marca; meta = línea naranja.
const props = defineProps({ progress: { type: Object, required: true } }) // { series: [{ modulo, items }] }
const { t, lang } = useI18n()
const p = computed(() => t.value.retro.progress)
const mod = (n) => t.value.retro.module(n)

const fmt = (iso) =>
  new Date(iso)
    .toLocaleDateString(lang.value === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short', timeZone: 'America/Bogota' })
    .replace('.', '')

const panels = computed(() =>
  props.progress.series.map((s) => {
    const cols = s.items.map((it) => ({
      id: it.id,
      diag: it.tipo === 'DIAGNOSTICO',
      v: it.puntaje,
      name: it.tipo === 'DIAGNOSTICO' ? p.value.diag : p.value.post(it.n),
      date: fmt(it.fecha),
    }))
    const first = cols[0]?.v ?? 0
    const last = cols[cols.length - 1]?.v ?? 0
    const delta = cols.length > 1 ? last - first : null
    return {
      modulo: s.modulo,
      cols,
      best: Math.max(...cols.map((c) => c.v)),
      delta,
      cls: delta === null ? '' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'same',
      alt: p.value.alt(mod(s.modulo), cols.map((c) => `${c.name} ${c.v} %`).join(', ')),
    }
  }),
)
</script>

<template>
  <section class="card re-prog" aria-labelledby="re-prog-title">
    <header class="re-prog-head">
      <span class="re-ico"><AppIcon name="chart" :size="24" /></span>
      <div class="ttl">
        <h2 id="re-prog-title">{{ p.title }}</h2>
        <p>{{ p.text }}</p>
      </div>
      <ul class="re-prog-legend">
        <li><span class="sw diag"></span>{{ p.diag }}</li>
        <li><span class="sw post"></span>{{ p.legendPost }}</li>
        <li><span class="sw goal"></span>{{ p.goal(GOAL) }}</li>
      </ul>
    </header>

    <div class="re-prog-grid">
      <article v-for="m in panels" :key="m.modulo" class="re-prog-mod">
        <div class="top">
          <span class="re-tag">{{ mod(m.modulo) }}</span>
          <span class="best">{{ p.best }} <b>{{ m.best }} %</b></span>
          <span v-if="m.delta !== null" class="re-pill" :class="m.cls">{{ p.change(signed(m.delta)) }}</span>
        </div>

        <div class="plot" role="img" :aria-label="m.alt" :style="{ '--n': m.cols.length }">
          <span class="goal-line" :style="{ bottom: `${GOAL}%` }"></span>
          <div
            v-for="c in m.cols"
            :key="c.id"
            class="col"
            :class="c.diag ? 'diag' : 'post'"
            :title="p.bar(c.name, c.v, c.id)"
          >
            <span class="bar" :style="{ height: `${Math.max(c.v, 2)}%` }"></span>
            <span class="v" :style="{ bottom: `calc(${Math.max(c.v, 2)}% + 6px)` }">{{ c.v }}%</span>
          </div>
        </div>
        <div class="names" :style="{ '--n': m.cols.length }" aria-hidden="true">
          <span v-for="c in m.cols" :key="c.id"><b>{{ c.name }}</b><small>{{ c.date }}</small></span>
        </div>
      </article>
    </div>
  </section>
</template>
