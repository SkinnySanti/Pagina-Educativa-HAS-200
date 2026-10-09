<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Tarjeta de un examen (uno por módulo).
//   status: 'login' (sin sesión: sin botón, solo el recuadro "Inicia sesión para…")
//           'locked' (con sesión, falta la guía) · 'available' (se puede presentar)
const props = defineProps({
  option: { type: Number, required: true }, // 0 diagnóstica · 1 post recorrido
  module: { type: Number, required: true }, // 0 = Módulo 1 · 1 = Módulo 2
  status: { type: String, required: true },
  guide: { type: Object, required: true }, // { done, count, total } de la guía de este módulo
})
const emit = defineEmits(['start'])
const { t } = useI18n()
const e = computed(() => t.value.examenes)
const m = computed(() => e.value.modules[props.module])
const available = computed(() => props.status === 'available')

const lockText = computed(() => {
  const lock = e.value.card.lock
  if (props.status === 'login') return props.option === 0 ? lock.login : lock.loginGuide[props.module]
  return lock.guide[props.module]
})
// Barra de avance de la guía: solo con sesión y mientras falta terminarla (Módulo 1 tiene 6 pasos).
const showProgress = computed(() => props.status === 'locked' && props.guide.total)
const pct = computed(() => (props.guide.total ? (props.guide.count / props.guide.total) * 100 : 0))
</script>

<template>
  <article class="card exam" :class="{ lock: !available }">
    <div class="top">
      <span class="ico"><AppIcon :name="module ? 'cpu' : 'gear'" :size="24" /></span>
      <span class="tag">{{ m.tag }}</span>
      <span class="ex-state" :class="{ ok: available }">
        <AppIcon :name="available ? 'check' : 'lock'" :size="14" />{{ e.state[status] }}
      </span>
    </div>

    <h3>{{ e.card.title(module + 1) }}</h3>
    <p class="sub">{{ m.guide }} · {{ m.text }}</p>

    <ul class="meta">
      <li><AppIcon name="clipboard" :size="16" />{{ e.card.meta.questions }}</li>
      <li><AppIcon name="clock" :size="16" />{{ e.card.meta.time }}</li>
      <li><AppIcon name="star" :size="16" />{{ e.card.meta.score }}</li>
    </ul>

    <div v-if="!available" class="lockbox">
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
    </div>

    <button v-if="available" type="button" class="btn btn-primary" @click="emit('start')">
      <AppIcon name="pencil" :size="18" />{{ e.card.start }}
    </button>
    <button v-else-if="status === 'locked'" type="button" class="btn btn-ghost" disabled>
      <AppIcon name="lock" :size="18" />{{ e.card.locked }}
    </button>
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
.lockbox:last-child { margin-top: auto; }
.lockbox p { display: flex; gap: 8px; align-items: flex-start; }
.lockbox p svg { flex: none; margin-top: 2px; color: var(--blue-900); }
.bar { height: 8px; border-radius: 9px; background: var(--line); overflow: hidden; margin: 10px 0 4px; }
.bar i { display: block; height: 100%; background: var(--grad); transition: width 0.4s ease; }
.pp { font-size: 12.5px; font-weight: 600; color: var(--blue-900); }

.exam .btn { margin-top: auto; width: 100%; }
</style>
