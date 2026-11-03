<script setup>
import { computed } from 'vue'
import { useI18n } from '../../i18n'
import { GOAL, MODULES, SKILL_KEYS, conceptLabel, joinList, levelOf, mmss, reinforcePlan, signed } from '../../utils/feedbackStats.js'

// Reporte en formato de certificado (A4 horizontal). Tiene su PROPIA paleta clara fija (--k-*) porque es un documento
// impreso: no debe cambiar con el modo oscuro de la página. Las medidas y el borde están en styles/retro.css (.rc-*).
const props = defineProps({
  alias: { type: String, default: '' },
  stats: { type: Object, required: true },
  skills: { type: Array, required: true },
  compare: { type: Object, required: true },
  errors: { type: Array, required: true },
  basis: { type: String, default: 'post' },
})
const { t, lang } = useI18n()
const c = computed(() => t.value.retro.report.cert)
const k = computed(() => t.value.retro.kpis)
const names = computed(() => t.value.retro.skills.list)
const levels = computed(() => t.value.retro.skills.levels)
const rf = computed(() => t.value.retro.reinforce)

const issued = computed(() =>
  c.value.issued(
    new Date().toLocaleDateString(lang.value === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' }),
  ),
)

const stats = computed(() => [
  { l: k.value.attempts.label, v: String(props.stats.intentos), u: '' },
  { l: k.value.best.label, v: props.stats.intentos ? String(props.stats.mejor) : '—', u: props.stats.intentos ? '%' : '' },
  { l: k.value.gain.label, v: props.stats.mejora === null ? '—' : signed(props.stats.mejora), u: props.stats.mejora === null ? '' : k.value.gain.unit },
  { l: k.value.time.label, v: props.stats.tiempo === null ? '—' : mmss(props.stats.tiempo), u: props.stats.tiempo === null ? '' : k.value.time.unit },
])

const rows = computed(() =>
  SKILL_KEYS.map((key) => {
    const s = props.skills.find((x) => x.key === key)
    const cur = s?.[props.basis] ?? null
    return { key, name: names.value[key].name, p: cur ? cur.p : null, lv: cur ? levelOf(cur.p) : 'n', diag: s?.diag?.p ?? null, post: s?.post?.p ?? null }
  }),
)

const mods = computed(() =>
  MODULES.map((m) => {
    const d = props.compare[m]
    return { m, diag: d?.diag?.puntaje ?? null, post: d?.post?.puntaje ?? null }
  }),
)

const plan = computed(() => reinforcePlan(props.skills, props.errors))
const reinforceText = computed(() => {
  if (!plan.value.focus.length && !plan.value.concepts.length) return rf.value.done
  const a = []
  if (plan.value.focus.length) a.push(rf.value.skills(joinList(plan.value.focus.map((f) => names.value[f.key].name.toLowerCase()), rf.value.and)))
  if (plan.value.concepts.length) a.push(rf.value.concepts(joinList(plan.value.concepts.slice(0, 3).map((x) => conceptLabel(t.value, x.concepto)), rf.value.and)))
  return a.join(' ')
})
</script>

<template>
  <div class="rc" role="document" :aria-label="c.title">
    <div class="rc-frame" aria-hidden="true"></div>
    <div class="rc-frame in" aria-hidden="true"></div>

    <header class="rc-top">
      <div class="rc-brand">
        <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
          <rect x="3" y="14" width="8" height="17" rx="2.5" fill="#1b4f9c" /><rect x="13" y="5" width="8" height="26" rx="2.5" fill="#0e9f8a" /><rect x="23" y="10" width="8" height="21" rx="2.5" fill="#1b4f9c" />
        </svg>
        <span><b>{{ c.brand }}</b><small>{{ c.lab }}</small></span>
      </div>
      <span class="rc-date">{{ issued }}</span>
    </header>

    <div class="rc-title">
      <h1>{{ c.title }}</h1>
      <p class="to">{{ c.grantedTo }}</p>
      <p class="name">{{ alias }}</p>
      <p class="txt">{{ c.text }}</p>
    </div>

    <ul class="rc-stats">
      <li v-for="x in stats" :key="x.l"><b>{{ x.v }}<small v-if="x.u">{{ x.u }}</small></b><span>{{ x.l }}</span></li>
    </ul>

    <div class="rc-body">
      <section class="rc-skills">
        <h2>{{ c.skills }}</h2>
        <div v-for="r in rows" :key="r.key" class="rc-skill">
          <span class="n">{{ r.name }}</span>
          <span class="track"><i :class="r.lv" :style="{ width: `${r.p ?? 0}%` }"></i><u :style="{ left: `${GOAL}%` }"></u></span>
          <span class="p">{{ r.p === null ? '—' : r.p + ' %' }}</span>
          <span class="lv" :class="r.lv">{{ r.lv === 'n' ? '—' : levels[r.lv] }}</span>
        </div>
        <p class="goal"><u></u>{{ c.goal(GOAL) }}</p>
      </section>

      <section class="rc-side">
        <h2>{{ c.compare }}</h2>
        <ul class="rc-cmp">
          <li v-for="x in mods" :key="x.m">
            <b>{{ t.retro.module(x.m) }}</b>
            <span v-if="x.diag !== null && x.post !== null">{{ x.diag }} % → <strong>{{ x.post }} %</strong> <em :class="x.post - x.diag >= 0 ? 'up' : 'down'">{{ signed(x.post - x.diag) }} pts</em></span>
            <span v-else-if="x.diag !== null">{{ x.diag }} % · {{ c.noPost }}</span>
            <span v-else>—</span>
          </li>
        </ul>
        <h2 class="second">{{ c.reinforce }}</h2>
        <p class="rc-ref">{{ reinforceText }}</p>
      </section>
    </div>

    <footer class="rc-foot">
      <div class="rc-sign"><span class="line"></span><b>{{ c.sign }}</b><small>{{ c.signRole }}</small></div>
      <div class="rc-seal" aria-hidden="true">
        <svg viewBox="0 0 100 100" width="84" height="84">
          <circle cx="50" cy="50" r="46" fill="#0b8564" /><circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 3" />
          <path d="M32 51l12 12 24-26" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ c.seal }}</span>
      </div>
      <p class="rc-note">{{ c.note }}</p>
    </footer>
  </div>
</template>
