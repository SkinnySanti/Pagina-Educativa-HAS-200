<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import RetroDonut from './RetroDonut.vue'
import { useI18n } from '../../i18n'
import { levelOf } from '../../utils/feedbackStats.js'

// Una tarjeta por habilidad (con su dona). Al tocarla se filtran los errores de esa habilidad.
const props = defineProps({
  skills: { type: Array, required: true },
  mode: { type: String, default: 'post' }, // con qué datos se pinta la dona: 'post' o 'diag'
  active: { type: String, default: 'ALL' },
})
const emit = defineEmits(['select'])
const { t } = useI18n()
const s = computed(() => t.value.retro.skills)
const ICON = { f: 'check', p: 'clock', r: 'alert' }

const cards = computed(() =>
  props.skills.map((k) => {
    const cur = k[props.mode]
    const lv = cur ? levelOf(cur.p) : 'n'
    return { key: k.key, cur, lv, diag: k.diag, post: k.post, ...s.value.list[k.key] }
  }),
)
</script>

<template>
  <div class="re-skills-wrap">
    <div class="re-skills">
      <button
        v-for="c in cards"
        :key="c.key"
        type="button"
        class="card re-skill"
        :aria-pressed="active === c.key"
        @click="emit('select', c.key)"
      >
        <RetroDonut :value="c.cur ? c.cur.p : null" :level="c.lv" :label="`${c.name}: ${c.cur ? c.cur.p + ' %' : '—'}`" />
        <h3>{{ c.name }}</h3>
        <span v-if="c.cur" class="re-level" :class="c.lv"><AppIcon :name="ICON[c.lv]" :size="13" />{{ s.levels[c.lv] }}</span>
        <span class="desc">{{ c.desc }}</span>
        <span v-if="c.cur" class="ok">{{ s.correct(c.cur.a, c.cur.t) }}</span>
        <span v-if="c.diag && c.post" class="prev">{{ s.from }} <b>{{ c.diag.p }} %</b> → <b>{{ c.post.p }} %</b></span>
        <span v-else-if="c.diag" class="prev">{{ s.from }} <b>{{ c.diag.p }} %</b></span>
      </button>
    </div>
  </div>
</template>
