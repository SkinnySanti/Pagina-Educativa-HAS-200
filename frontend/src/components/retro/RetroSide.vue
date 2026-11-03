<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { GOAL, conceptLabel, hasMode, joinList, reinforcePlan, tutorTips } from '../../utils/feedbackStats.js'

// Lateral (va DEBAJO de las 4 tarjetas): "¿Listo para el laboratorio?" y "Qué reforzar" (resumen + preguntas para el tutor).
const props = defineProps({
  skills: { type: Array, required: true },
  errors: { type: Array, required: true },
})
const { t } = useI18n()
const s = computed(() => t.value.retro.side)
const rf = computed(() => t.value.retro.reinforce)
const names = computed(() => t.value.retro.skills.list)

const hasPost = computed(() => hasMode(props.skills, 'post'))
const post = computed(() => props.skills.filter((k) => k.post))
const ready = computed(() => (post.value.length ? Math.round(post.value.reduce((n, k) => n + k.post.p, 0) / post.value.length) : 0))
const missing = computed(() => post.value.filter((k) => k.post.p < GOAL).map((k) => names.value[k.key].name.toLowerCase()))

const plan = computed(() => reinforcePlan(props.skills, props.errors))
const tips = computed(() => tutorTips(t.value, plan.value))
const isDone = computed(() => !plan.value.focus.length && !plan.value.concepts.length)
const summary = computed(() => {
  const a = []
  if (plan.value.focus.length) a.push(rf.value.skills(joinList(plan.value.focus.map((f) => names.value[f.key].name.toLowerCase()), rf.value.and)))
  if (plan.value.concepts.length) a.push(rf.value.concepts(joinList(plan.value.concepts.slice(0, 3).map((c) => conceptLabel(t.value, c.concepto)), rf.value.and)))
  return a.join(' ')
})
const askTo = (prompt) => ({ path: '/tutor', query: { q: prompt } })
</script>

<template>
  <aside class="re-side" :aria-label="s.label">
    <section v-if="hasPost" class="card re-ready" aria-labelledby="re-ready-t">
      <h3 id="re-ready-t">{{ s.ready.title }}</h3>
      <div class="big" :class="{ mid: ready < GOAL }">{{ ready }}<small>%</small></div>
      <div
        class="meter"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="ready"
        :aria-valuetext="s.ready.meter(ready, GOAL)"
      >
        <i :style="{ width: `${ready}%` }"></i><span class="goal" :style="{ left: `${GOAL}%` }"></span>
      </div>
      <div class="meta"><span>0 %</span><span>{{ s.ready.goal(GOAL) }}</span></div>
      <p class="txt">{{ missing.length ? s.ready.missing(GOAL, missing.join(', ')) : s.ready.done }}</p>
    </section>

    <section class="re-reinforce" aria-labelledby="re-rf-t">
      <h3 id="re-rf-t"><AppIcon name="robot" :size="18" />{{ rf.title }}</h3>
      <p v-if="isDone" class="sum">{{ rf.done }}</p>
      <template v-else>
        <p class="sum">{{ summary }} {{ rf.how }}</p>
        <div class="tips-head"><b>{{ rf.tipsTitle }}</b><span>{{ rf.tipsText }}</span></div>
        <ul class="tips">
          <li v-for="x in tips" :key="x.id">
            <span class="lbl">{{ x.label }}</span>
            <q class="q">{{ x.prompt }}</q>
            <RouterLink :to="askTo(x.prompt)" class="btn btn-primary btn-sm"><AppIcon name="robot" :size="15" />{{ rf.ask }}</RouterLink>
          </li>
        </ul>
      </template>
    </section>
  </aside>
</template>
