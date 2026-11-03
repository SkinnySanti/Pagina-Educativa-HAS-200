<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { SKILL_KEYS, conceptLabel } from '../../utils/feedbackStats.js'

// Errores del intento más reciente de cada módulo, con filtro por habilidad (el mismo que activan las tarjetas de habilidades).
const props = defineProps({
  errors: { type: Array, required: true },
  modelValue: { type: String, default: 'ALL' },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const e = computed(() => t.value.retro.errors)
const names = computed(() => t.value.retro.skills.list)
const mod = (n) => t.value.retro.module(n)

const counts = computed(() => Object.fromEntries(SKILL_KEYS.map((k) => [k, props.errors.filter((x) => x.habilidad === k).length])))
const list = computed(() => (props.modelValue === 'ALL' ? props.errors : props.errors.filter((x) => x.habilidad === props.modelValue)))

// referenciaModulo = "mX:paso" con el paso en base 0 → "Guía X · Paso (paso + 1)".
function guideLink(ref) {
  const m = /^m(\d+):(\d+)$/.exec(ref || '')
  if (!m) return null
  const g = Number(m[1])
  const step = Number(m[2]) + 1
  return { g, step, to: { path: '/guias', query: { modulo: String(g), paso: String(step) } } }
}
</script>

<template>
  <div class="re-filters" role="group" :aria-label="e.filter">
    <button type="button" class="re-fil" :aria-pressed="modelValue === 'ALL'" @click="emit('update:modelValue', 'ALL')">
      {{ e.all }} <span class="n">{{ errors.length }}</span>
    </button>
    <button
      v-for="k in SKILL_KEYS"
      :key="k"
      type="button"
      class="re-fil"
      :aria-pressed="modelValue === k"
      @click="emit('update:modelValue', k)"
    >
      {{ names[k].name }} <span class="n">{{ counts[k] }}</span>
    </button>
  </div>

  <ol v-if="list.length" class="re-errs" aria-live="polite">
    <li v-for="(x, i) in list" :key="`${x.modulo}-${x.concepto}-${i}`" class="card re-err">
      <div class="tags">
        <span class="re-tag">{{ names[x.habilidad]?.name ?? x.habilidad }}</span>
        <span class="re-tag g">{{ mod(x.modulo) }}</span>
        <span class="re-tag">{{ conceptLabel(t, x.concepto) }}</span>
      </div>
      <!-- texto plano siempre, nunca v-html -->
      <h3 :lang="x.idioma">{{ x.enunciado }}</h3>
      <div class="re-ans">
        <div class="re-box bad">
          <span class="r"><AppIcon name="alert" :size="14" />{{ e.yours }}</span>
          <span v-if="x.marcada === null" class="none">{{ e.unanswered }}</span>
          <span v-else :lang="x.idioma">{{ x.marcada }}</span>
        </div>
        <div class="re-box good">
          <span class="r"><AppIcon name="check" :size="14" />{{ e.correct }}</span>
          <span :lang="x.idioma">{{ x.correcta }}</span>
        </div>
      </div>
      <p v-if="x.explicacion" class="re-why"><b>{{ e.why }}</b> {{ x.explicacion }}</p>
      <div class="re-acts">
        <RouterLink v-if="guideLink(x.ref)" :to="guideLink(x.ref).to" class="btn btn-ghost btn-sm">
          <AppIcon name="book" :size="16" />{{ e.study(guideLink(x.ref).g, guideLink(x.ref).step) }}
        </RouterLink>
        <RouterLink to="/tutor" class="btn btn-ghost btn-sm"><AppIcon name="robot" :size="16" />{{ e.askTutor }}</RouterLink>
      </div>
    </li>
  </ol>
  <div v-else class="card re-empty">
    <span class="re-ico"><AppIcon name="check" :size="24" /></span><span>{{ e.none }}</span>
  </div>
</template>
