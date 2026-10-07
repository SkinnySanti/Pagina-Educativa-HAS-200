<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import '../styles/guias.css'
import AppIcon from '../components/common/AppIcon.vue'
import RevealOnScroll from '../components/common/RevealOnScroll.vue'
import GuideHero from '../components/guias/GuideHero.vue'
import ModulePicker from '../components/guias/ModulePicker.vue'
import GuideToc from '../components/guias/GuideToc.vue'
import GuideFinish from '../components/guias/GuideFinish.vue'
import Step1Flow from '../components/guias/steps/Step1Flow.vue'
import Step2Stations from '../components/guias/steps/Step2Stations.vue'
import Step3Quiz from '../components/guias/steps/Step3Quiz.vue'
import Step4Beacon from '../components/guias/steps/Step4Beacon.vue'
import Step5Industry from '../components/guias/steps/Step5Industry.vue'
import Step6Glossary from '../components/guias/steps/Step6Glossary.vue'
import M2Step1Plc from '../components/guias/m2/M2Step1Plc.vue'
import M2Step2Signals from '../components/guias/m2/M2Step2Signals.vue'
import M2Step3Journey from '../components/guias/m2/M2Step3Journey.vue'
import M2Step4Network from '../components/guias/m2/M2Step4Network.vue'
import M2Step5Scada from '../components/guias/m2/M2Step5Scada.vue'
import M2Step6Match from '../components/guias/m2/M2Step6Match.vue'
import { useGuideProgress } from '../composables/useGuideProgress'
import { useI18n } from '../i18n'

const { t } = useI18n()
const g = computed(() => t.value.guias)

// Módulo 1 · Guía informativa  |  Módulo 2 · Cómo piensa y se comunica
const modules = {
  m1: [Step1Flow, Step2Stations, Step3Quiz, Step4Beacon, Step5Industry, Step6Glossary],
  m2: [M2Step1Plc, M2Step2Signals, M2Step3Journey, M2Step4Network, M2Step5Scada, M2Step6Match],
}
const progresses = {
  m1: useGuideProgress('m1', modules.m1.length),
  m2: useGuideProgress('m2', modules.m2.length),
}

const mod = ref('m1')
const steps = computed(() => modules[mod.value])
const total = computed(() => steps.value.length)
const titles = computed(() => (mod.value === 'm2' ? g.value.m2.toc.steps : g.value.toc.steps))
const progress = computed(() => progresses[mod.value])

// Si ya avanzó, retoma en el primer paso sin leer; si terminó todo, empieza de nuevo.
const current = ref(progresses.m1.resumeAt.value)
const finished = ref(false)

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function toTop() {
  document.getElementById('guia-layout')?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' })
}
// Tras el cambio de paso, el foco va al título nuevo (lectores de pantalla y teclado).
const focusTitle = () => document.getElementById('guia-paso')?.focus({ preventScroll: true })

function selectModule(key) {
  if (key !== mod.value) {
    mod.value = key
    finished.value = false
    current.value = progresses[key].resumeAt.value
  }
  toTop()
}
function go(i) {
  finished.value = false
  current.value = i
  toTop()
}
function next() {
  progress.value.mark(current.value)
  if (current.value < total.value - 1) return go(current.value + 1)
  finished.value = true
  toTop()
}
const prev = () => current.value > 0 && go(current.value - 1)
</script>

<template>
  <div class="guia content">
    <nav class="crumbs" :aria-label="g.crumbs.label">
      <RouterLink to="/">{{ g.crumbs.home }}</RouterLink>
      <AppIcon name="chevron-right" :size="14" />
      <span>{{ g.crumbs.guides }}</span>
      <AppIcon name="chevron-right" :size="14" />
      <b aria-current="page">{{ mod === 'm2' ? g.crumbs.module2 : g.crumbs.module1 }}</b>
    </nav>

    <GuideHero :module="mod" />
    <RevealOnScroll><ModulePicker :active="mod" @select="selectModule" /></RevealOnScroll>

    <div id="guia-layout" class="layout">
      <div class="col">
        <Transition name="gstep" mode="out-in" @after-enter="focusTitle">
          <GuideFinish v-if="finished" :key="`${mod}-fin`" :module="mod" @review="go(0)" @next="selectModule('m2')" />
          <component :is="steps[current]" v-else :key="`${mod}-${current}`" />
        </Transition>

        <nav v-if="!finished" class="pager" :aria-label="g.pager.label">
          <button type="button" class="btn btn-ghost" :disabled="current === 0" @click="prev">
            <AppIcon name="chevron-left" :size="18" />{{ g.pager.prev }}
          </button>
          <button type="button" class="btn btn-primary" @click="next">
            <template v-if="current < total - 1">{{ g.pager.next(current + 2, titles[current + 1]) }}</template>
            <template v-else>{{ g.pager.finish }}</template>
            <AppIcon :name="current < total - 1 ? 'chevron-right' : 'check'" :size="18" />
          </button>
        </nav>
      </div>

      <GuideToc :current="current" :seen="progress.seen.value" :finished="finished" :steps="titles" @go="go" />
    </div>
  </div>
</template>

<style scoped>
/* Mismas medidas de página que Inicio */
.content { padding: 28px; max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

.crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 14px; color: var(--ink-2); margin-bottom: -12px; }
.crumbs a { color: var(--ink-2); text-decoration: none; border-radius: 6px; transition: color 0.15s ease; }
.crumbs a:hover { color: var(--blue-900); text-decoration: underline; }
.crumbs b { color: var(--blue-900); font-weight: 600; }

.layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 24px; align-items: start; scroll-margin-top: calc(var(--header-h) + 12px); }
.col { display: grid; gap: 18px; min-width: 0; }

.pager { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }

.gstep-enter-active, .gstep-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.gstep-enter-from { opacity: 0; transform: translateY(8px); }
.gstep-leave-to { opacity: 0; }

@media (max-width: 1040px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .layout > :last-child { order: -1; }
}
@media (max-width: 960px) {
  .content { padding: 16px; gap: 20px; }
}
@media (max-width: 640px) {
  .pager .btn { width: 100%; }
}
</style>
