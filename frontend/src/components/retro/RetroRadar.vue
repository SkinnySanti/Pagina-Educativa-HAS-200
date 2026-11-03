<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { GOAL, hasMode, levelOf, signed, valueOf } from '../../utils/feedbackStats.js'

// Gráfico de araña de las 4 habilidades. Muestra UN solo conjunto de datos a la vez (diagnóstica o post actual)
// y cambia con el selector; la figura se anima al cambiar. Todo en verde de marca (--green-cta).
const props = defineProps({ skills: { type: Array, required: true } })
const { t } = useI18n()
const r = computed(() => t.value.retro.radar)
const names = computed(() => t.value.retro.skills.list)
const ICON = { f: 'check', p: 'clock', r: 'alert', n: 'clock' }

const has = computed(() => ({ diag: hasMode(props.skills, 'diag'), post: hasMode(props.skills, 'post') }))
const mode = ref(has.value.post ? 'post' : 'diag')
// Si el modo elegido deja de tener datos (p. ej. se recargó la página), se pasa al que sí tiene.
watch(has, (h) => {
  if (!h[mode.value]) mode.value = h.post ? 'post' : 'diag'
})

/* ───── Geometría ───── */
const VB = '0 0 530 392', CX = 265, CY = 182, RAD = 124
const n = computed(() => props.skills.length)
const ang = (i) => -Math.PI / 2 + (2 * Math.PI * i) / n.value
const pt = (i, v) => [CX + RAD * (v / 100) * Math.cos(ang(i)), CY + RAD * (v / 100) * Math.sin(ang(i))]
const poly = (vals) => vals.map((v, i) => pt(i, v).map((c) => c.toFixed(1)).join(',')).join(' ')

const rings = [20, 40, 60, 80, 100]
const ringPoints = computed(() => rings.map((v) => poly(props.skills.map(() => v))))
const axes = computed(() => props.skills.map((_, i) => pt(i, 100)))
const goalPoints = computed(() => poly(props.skills.map(() => GOAL)))

/* ───── Datos del modo elegido (con animación al cambiar) ───── */
const target = computed(() => props.skills.map((s) => valueOf(s, mode.value)))
const shown = ref(target.value.slice())
let raf = 0
watch(target, (to) => {
  cancelAnimationFrame(raf)
  const from = shown.value.slice()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = to.slice()
    return
  }
  const t0 = performance.now()
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 450)
    const e = 1 - Math.pow(1 - k, 3)
    shown.value = to.map((v, i) => from[i] + (v - from[i]) * e)
    if (k < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))

const areaPoints = computed(() => poly(shown.value))
const dots = computed(() =>
  props.skills.map((s, i) => {
    const [x, y] = pt(i, shown.value[i])
    return { key: s.key, x, y, title: `${names.value[s.key].name} · ${r.value.modes[mode.value]}: ${target.value[i]} %` }
  }),
)

/* ───── Etiquetas de los ejes ───── */
const labels = computed(() =>
  props.skills.map((s, i) => {
    const a = ang(i)
    const lx = CX + (RAD + 16) * Math.cos(a)
    const ly = CY + (RAD + 16) * Math.sin(a)
    const anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end'
    const name = names.value[s.key].name
    const words = name.split(' ')
    const lines = name.length > 14 ? [words[0], words.slice(1).join(' ')] : [name]
    const y0 = Math.sin(a) < -0.5 ? ly - 17 * (lines.length - 1) - 8 : Math.sin(a) > 0.5 ? ly + 15 : ly + 4 - 8 * (lines.length - 1)
    const ok = !!s[mode.value]
    return { key: s.key, x: lx.toFixed(1), y0, anchor, lines, value: ok ? `${target.value[i]} %` : '—', lv: ok ? levelOf(target.value[i]) : 'n' }
  }),
)

/* ───── Lectura (cambia con el selector) ───── */
const insights = computed(() => {
  const m = mode.value
  const rows = props.skills.map((s, i) => ({ s, v: target.value[i], ok: !!s[m] })).filter((x) => x.ok)
  if (!rows.length) return []
  const best = rows.reduce((a, b) => (b.v > a.v ? b : a))
  const low = rows.reduce((a, b) => (b.v < a.v ? b : a))
  const out = [
    { t: r.value.best, name: names.value[best.s.key].name, level: levelOf(best.v), v: `${best.v} %` },
    { t: r.value.lowest, name: names.value[low.s.key].name, level: levelOf(low.v), v: `${low.v} %` },
  ]
  const grown = props.skills.filter((s) => s.diag && s.post).map((s) => ({ s, d: s.post.p - s.diag.p }))
  if (m === 'post' && grown.length) {
    const g = grown.reduce((a, b) => (b.d > a.d ? b : a))
    out.push({ t: r.value.grew, name: names.value[g.s.key].name, pill: g.d > 0 ? 'up' : g.d < 0 ? 'down' : 'same', v: r.value.pts(signed(g.d)) })
  } else {
    const avg = Math.round(rows.reduce((n, x) => n + x.v, 0) / rows.length)
    out.push({ t: r.value.average, name: '', level: levelOf(avg), v: `${avg} %` })
  }
  return out
})

const aria = computed(() => {
  const parts = props.skills.map((s, i) => `${names.value[s.key].name} ${s[mode.value] ? target.value[i] + ' %' : '—'}`).join('; ')
  return r.value.aria(r.value.modes[mode.value], parts, GOAL)
})
</script>

<template>
  <article class="card re-radar" aria-labelledby="re-radar-title">
    <svg class="radar" :viewBox="VB" role="img" :aria-label="aria">
      <polygon v-for="(p, i) in ringPoints" :key="rings[i]" class="rd-ring" :points="p" />
      <line v-for="(a, i) in axes" :key="i" class="rd-axis" :x1="CX" :y1="CY" :x2="a[0].toFixed(1)" :y2="a[1].toFixed(1)" />
      <text v-for="v in [50, 100]" :key="v" class="rd-scale" :x="CX + 5" :y="(CY - (RAD * v) / 100 + 4).toFixed(1)">{{ v }}</text>
      <polygon class="rd-goal" :points="goalPoints" />
      <polygon v-if="has[mode]" class="rd-area" :points="areaPoints" />
      <g v-for="d in dots" v-show="has[mode]" :key="d.key" class="rd-pt" tabindex="0">
        <title>{{ d.title }}</title>
        <rect class="rd-dot" :x="(d.x - 6).toFixed(1)" :y="(d.y - 6).toFixed(1)" width="12" height="12" rx="3" />
      </g>
      <text v-for="l in labels" :key="l.key" class="rd-lbl" :text-anchor="l.anchor">
        <tspan v-for="(line, k) in l.lines" :key="k" :x="l.x" :y="(l.y0 + k * 17).toFixed(1)">{{ line }}</tspan>
        <tspan :x="l.x" dy="17" class="rd-pct" :class="l.lv">{{ l.value }}</tspan>
      </text>
    </svg>

    <div class="side">
      <h3 id="re-radar-title">{{ r.title }}</h3>

      <div class="re-switch" role="group" :aria-label="r.switchLabel">
        <button v-for="m in ['diag', 'post']" :key="m" type="button" :aria-pressed="mode === m" :disabled="!has[m]" @click="mode = m">
          {{ r.modes[m] }}
        </button>
      </div>

      <p aria-live="polite">{{ r.text[mode] }}</p>
      <p v-if="!has[mode]" class="re-nodata">{{ r.noData[mode] }}</p>

      <ul class="re-rlegend">
        <li><span class="k"></span>{{ r.modes[mode] }}</li>
        <li><span class="k g"></span>{{ r.goal(GOAL) }}</li>
      </ul>

      <ul v-if="insights.length" class="re-insights">
        <li v-for="x in insights" :key="x.t">
          <span class="lbl">{{ x.t }}<b v-if="x.name">{{ x.name }}</b></span>
          <span v-if="x.pill" class="re-pill" :class="x.pill">{{ x.v }}</span>
          <span v-else class="re-level" :class="x.level"><AppIcon :name="ICON[x.level]" :size="13" />{{ x.v }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>
