<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Tarjeta de un examen (uno por módulo). `status` lo calcula useExamAccess a partir de GET /api/exams:
//   'login' (sin sesión: sin botón, solo el recuadro "Inicia sesión para…") · 'loading' (llega la lista)
//   'locked' (BLOQUEADO_GUIA) · 'available' (DISPONIBLE: Comenzar o Reanudar) · 'used' (diagnóstico ya enviado)
const props = defineProps({
  option: { type: Number, required: true }, // 0 diagnóstica · 1 post recorrido
  module: { type: Number, required: true }, // 0 = Módulo 1 · 1 = Módulo 2
  status: { type: String, required: true },
  guide: { type: Object, required: true }, // { done, count, total, ready } del avance de la guía de este módulo (servidor)
  exam: { type: Object, default: null }, // fila de GET /api/exams (tiempoLimiteMinutos, intentoEnCursoId…)
  busy: Boolean, // se está iniciando ESTE examen (botón deshabilitado: evita dos intentos)
  disabled: Boolean, // hay otro examen abierto en pantalla
  reviewId: { type: Number, default: null }, // último intento enviado conocido, para abrir la revisión
})
const emit = defineEmits(['start', 'review'])
const { t } = useI18n()
const e = computed(() => t.value.examenes)
const m = computed(() => e.value.modules[props.module])

const available = computed(() => props.status === 'available')
const used = computed(() => props.status === 'used')
const inProgress = computed(() => available.value && !!props.exam?.intentoEnCursoId)
const pillIcon = computed(() => (available.value || used.value ? 'check' : props.status === 'loading' ? 'clock' : 'lock'))

// Datos del examen: salen del servidor; los valores por defecto son solo para mientras llega la lista.
const questions = computed(() => e.value.card.meta.questions(props.exam?.totalPreguntas ?? 10, props.exam?.preguntasEnIngles ?? 2))
const time = computed(() => e.value.card.meta.time(props.exam?.tiempoLimiteMinutos ?? null))

const showLock = computed(() => props.status === 'locked' || props.status === 'login')
const lockText = computed(() => {
  const lock = e.value.card.lock
  if (props.status === 'login') return props.option === 0 ? lock.login : lock.loginGuide[props.module]
  // El servidor sigue diciendo "bloqueado" aunque la guía aparece completa: el último paso aún no se confirmó en la cuenta.
  if (props.guide.done) return lock.pendingSync
  return lock.guide[props.module]
})
// Barra de avance de la guía: solo con sesión, ya cargado el avance, y mientras falta terminarla.
const showProgress = computed(() => props.status === 'locked' && props.guide.total && props.guide.ready !== false && !props.guide.done)
// Enlace directo a la guía de este módulo (la guía retoma en el primer paso sin leer).
const guideTo = computed(() => ({ path: '/guias', query: { modulo: String(props.module + 1) } }))
const pct = computed(() => (props.guide.total ? (props.guide.count / props.guide.total) * 100 : 0))
</script>

<template>
  <article class="card exam" :class="{ lock: !available && !used }">
    <div class="top">
      <span class="ico"><AppIcon :name="module ? 'cpu' : 'gear'" :size="24" /></span>
      <span class="tag">{{ m.tag }}</span>
      <span class="ex-state" :class="{ ok: available || used }">
        <AppIcon :name="pillIcon" :size="14" />{{ e.state[status] }}
      </span>
    </div>

    <h3>{{ e.card.title(module + 1) }}</h3>
    <p class="sub">{{ m.guide }} · {{ m.text }}</p>

    <ul class="meta">
      <li><AppIcon name="clipboard" :size="16" />{{ questions }}</li>
      <li><AppIcon name="clock" :size="16" />{{ time }}</li>
      <li><AppIcon name="star" :size="16" />{{ e.card.meta.score }}</li>
    </ul>

    <div v-if="showLock" class="lockbox">
      <p><AppIcon name="lock" :size="16" /><span>{{ lockText }}</span></p>
      <template v-if="showProgress">
        <div
          class="bar"
          role="progressbar"
          aria-valuemin="0"
          :aria-valuemax="guide.total"
          :aria-valuenow="guide.count"
          :aria-valuetext="e.card.steps(guide.count, guide.total)"
        >
          <i :style="{ width: `${pct}%` }"></i>
        </div>
        <span class="pp">{{ e.card.steps(guide.count, guide.total) }}</span>
      </template>
      <RouterLink v-if="status === 'locked'" :to="guideTo" class="golink">
        {{e.card.goGuide }}<AppIcon name="chevron-right" :size="14" />
      </RouterLink>
    </div>

    <div v-else-if="used" class="lockbox info">
      <p><AppIcon name="check" :size="16" /><span>{{ reviewId ? e.card.used : e.card.usedNoReview }}</span></p>
    </div>

    <div v-else-if="inProgress" class="lockbox info">
      <p><AppIcon name="clock" :size="16" /><span>{{ e.card.inProgress }}</span></p>
    </div>

    <div class="acts">
      <template v-if="available">
        <button type="button" class="btn btn-primary" :disabled="busy || disabled" :aria-busy="busy" @click="emit('start')">
          <AppIcon :name="inProgress ? 'play' : 'pencil'" :size="18" />{{ busy ? e.card.starting : inProgress ? e.card.resume : e.card.start }}
        </button>
        <button v-if="reviewId" type="button" class="btn btn-ghost" :disabled="disabled" @click="emit('review')">
          <AppIcon name="eye" :size="18" />{{ e.card.lastReview }}
        </button>
      </template>
      <button v-else-if="used && reviewId" type="button" class="btn btn-primary" :disabled="disabled" @click="emit('review')">
        <AppIcon name="eye" :size="18" />{{ e.card.review }}
      </button>
      <button v-else-if="status === 'locked'" type="button" class="btn btn-ghost" disabled>
        <AppIcon name="lock" :size="18" />{{ e.card.locked }}
      </button>
      <button v-else-if="status === 'loading'" type="button" class="btn btn-ghost" disabled aria-busy="true">
        <AppIcon name="clock" :size="18" />{{ e.card.loading }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.exam {
  padding: 22px; display: flex; flex-direction: column; gap: 10px;
  border: 2px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.exam:not(.lock):hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--tint-blue); }
.exam:not(.lock):hover .ico { background: var(--blue-900); color: var(--on-accent); transform: scale(1.08) rotate(-6deg); }
.top { display: flex; align-items: center; gap: 10px; }
.top .ex-state { margin-left: auto; }
.ico {
  flex: none; width: 46px; height: 46px; border-radius: 12px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.tag { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; background: var(--tint-in); color: var(--blue-900); }
h3 { font-size: 19px; font-weight: 700; margin-top: 4px; }
.sub { font-size: 14px; color: var(--ink-2); }
.meta { list-style: none; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 13.5px; color: var(--ink-2); margin: 4px 0 6px; }
.meta li { display: inline-flex; align-items: center; gap: 6px; }
.meta svg { color: var(--blue-900); }

.lockbox { background: var(--bg); border-radius: 12px; padding: 12px 14px; font-size: 13.5px; color: var(--ink-2); }
.lockbox.info { background: var(--tint-green); color: var(--ink-teal); }
.lockbox p { display: flex; gap: 8px; align-items: flex-start; }
.lockbox p svg { flex: none; margin-top: 2px; color: var(--blue-900); }
.lockbox.info p svg { color: var(--ink-teal); }
.bar { height: 8px; border-radius: 9px; background: var(--line); overflow: hidden; margin: 10px 0 4px; }
.bar i { display: block; height: 100%; background: var(--grad); transition: width 0.4s ease; }
.pp { font-size: 12.5px; font-weight: 600; color: var(--blue-900); }
.golink { display: inline-flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 13.5px; font-weight: 700; color: var(--blue-900); text-decoration: none; border-radius: 6px; margin-left: 12px;}
.golink:hover { text-decoration: underline; }

.acts { margin-top: auto; display: grid; gap: 8px; }
.acts:empty { display: none; }
.acts .btn { width: 100%; }
</style>
