<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Resultado + revisión de errores de un intento ENVIADO (GET /api/attempts/{id}/review).
// Solo trae las preguntas falladas o sin responder; un 10/10 llega con `errores: []`.
const props = defineProps({
  title: { type: String, default: '' },
  summary: { type: Object, default: null }, // { puntaje, aciertos, total }
  review: { type: Object, default: null },
  reviewState: { type: String, default: 'idle' }, // 'idle' | 'loading' | 'ready' | 'error'
  reviewError: { type: String, default: '' }, // texto ya traducido
})
const emit = defineEmits(['close', 'retry'])
const { t } = useI18n()
const r = computed(() => t.value.examenes.result)
const x = computed(() => t.value.examenes.take)

const skill = (key) => r.value.skills[key] ?? key
// `concepto` es una clave estable, no texto visible: el nombre sale del i18n. Si falta, se muestra legible.
const concept = (key) => r.value.concepts[key] ?? key.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())

// referenciaModulo = "mX:paso" con el paso en base 0 → "Guía X · Paso (paso + 1)".
function guideLink(ref) {
  const m = /^m(\d+):(\d+)$/.exec(ref || '')
  if (!m) return null
  const mod = Number(m[1])
  const step = Number(m[2]) + 1
  return { mod, step, to: { path: '/guias', query: { modulo: String(mod), paso: String(step) } } }
}
</script>

<template>
  <article class="card result" aria-labelledby="exam-take-title">
    <header class="rhead">
      <span class="trophy"><AppIcon name="star" :size="30" /></span>
      <div class="rtxt">
        <h3 id="exam-take-title">{{ title }}</h3>
        <template v-if="summary">
          <p class="score"><b>{{ summary.puntaje }}</b><span>/ 100</span></p>
          <p class="sub">{{ r.hits(summary.aciertos, summary.total) }}</p>
        </template>
        <p v-else-if="reviewState === 'loading'" class="sub" role="status">{{ r.loading }}</p>
      </div>
      <button type="button" class="btn btn-ghost" @click="emit('close')">{{ r.close }}</button>
    </header>

    <div
      v-if="summary"
      class="bar"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="summary.puntaje"
      :aria-valuetext="`${summary.puntaje} / 100`"
    >
      <i :style="{ width: `${summary.puntaje}%` }"></i>
    </div>

    <section class="review" aria-labelledby="exam-review-title">
      <h4 id="exam-review-title">{{ r.reviewTitle }}</h4>

      <p v-if="reviewState === 'loading'" class="sub" role="status">{{ r.loading }}</p>

      <div v-else-if="reviewState === 'error'" class="alert" role="alert">
        <AppIcon name="alert" :size="18" />
        <span>{{ reviewError }}</span>
        <button type="button" class="link" @click="emit('retry')">{{ r.retry }}</button>
      </div>

      <p v-else-if="review && !review.errores.length" class="perfect">
        <AppIcon name="check" :size="18" />{{ r.perfect }}
      </p>

      <ol v-else-if="review" class="errs">
        <li v-for="er in review.errores" :key="er.preguntaId" class="err">
          <p class="eh">
            <span class="qn">{{ x.questionN(er.posicion) }}</span>
            <span v-if="er.idioma === 'en'" class="en" :title="x.englishTitle">EN</span>
            <span class="chip">{{ skill(er.habilidad) }}</span>
            <span class="chip alt">{{ concept(er.concepto) }}</span>
          </p>
          <!-- texto plano siempre, nunca v-html (CONTEXTO §9.5) -->
          <p class="eq" :lang="er.idioma">{{ er.enunciado }}</p>

          <div class="cmp">
            <div class="ans no">
              <span class="lbl"><AppIcon name="alert" :size="14" />{{ r.yours }}</span>
              <p :lang="er.opcionMarcada ? er.idioma : undefined" :class="{ none: !er.opcionMarcada }">
                {{ er.opcionMarcada ? er.opcionMarcada.texto : r.unanswered }}
              </p>
            </div>
            <div class="ans ok">
              <span class="lbl"><AppIcon name="check" :size="14" />{{ r.correct }}</span>
              <p :lang="er.idioma">{{ er.opcionCorrecta.texto }}</p>
            </div>
          </div>

          <p class="why">{{ er.explicacion }}</p>

          <RouterLink v-if="guideLink(er.referenciaModulo)" :to="guideLink(er.referenciaModulo).to" class="btn btn-ghost study">
            <AppIcon name="book" :size="16" />{{ r.study(guideLink(er.referenciaModulo).mod, guideLink(er.referenciaModulo).step) }}
          </RouterLink>
        </li>
      </ol>
    </section>
  </article>
</template>

<style scoped>
.result { padding: 24px 28px; display: grid; gap: 18px; border-left: 6px solid var(--teal-600); }
.rhead { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.trophy { flex: none; width: 56px; height: 56px; border-radius: 16px; background: var(--grad); color: var(--on-grad); display: grid; place-items: center; }
.rtxt { flex: 1 1 220px; min-width: 0; }
.rtxt h3 { font-size: 19px; font-weight: 700; }
.score { display: flex; align-items: baseline; gap: 6px; margin-top: 2px; }
.score b { font-size: 40px; line-height: 1; font-weight: 800; color: var(--blue-900); }
.score span { font-size: 16px; font-weight: 700; color: var(--ink-2); }
.sub { margin-top: 2px; font-size: 14px; color: var(--ink-2); }

.bar { height: 10px; border-radius: 9px; background: var(--line); overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--grad); transition: width 0.6s ease; }

.review h4 { font-size: 17px; font-weight: 700; margin-bottom: 10px; }
.perfect { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 12px; background: var(--tint-out); color: var(--ink-out); font-weight: 700; }
.alert { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 12px 14px; border-radius: 12px; background: var(--danger-tint); color: var(--danger); font-size: 14px; font-weight: 600; }
.link { background: none; border: 0; padding: 4px; font-weight: 700; color: inherit; text-decoration: underline; cursor: pointer; border-radius: 6px; }

.errs { list-style: none; display: grid; gap: 14px; }
.err { display: grid; gap: 10px; padding: 16px 18px; border: 2px solid var(--line); border-radius: 14px; background: var(--surface); }
.eh { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
.qn { font-size: 13px; font-weight: 700; color: var(--teal-600); }
.en { font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: var(--tint-pr); color: var(--ink-pr); }
.chip { font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: var(--tint-in); color: var(--ink-in); }
.chip.alt { background: var(--tint-muted); color: var(--ink-2); }
.eq { font-size: 16.5px; font-weight: 600; line-height: 1.4; }

.cmp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.ans { padding: 10px 12px; border-radius: 12px; display: grid; gap: 4px; font-size: 14.5px; }
.ans.no { background: var(--tint-pr); }
.ans.ok { background: var(--tint-out); }
.lbl { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em; }
.ans.no .lbl { color: var(--ink-pr); }
.ans.ok .lbl { color: var(--ink-out); }
.none { font-style: italic; color: var(--ink-2); }
.why { font-size: 14px; color: var(--ink-2); line-height: 1.5; }
.study { justify-self: start; padding: 9px 14px; font-size: 14px; }

@media (max-width: 720px) {
  .result { padding: 18px 16px; }
  .cmp { grid-template-columns: minmax(0, 1fr); }
  .rhead .btn { width: 100%; }
}
</style>
