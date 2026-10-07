<script setup>
import { computed, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.m2.s6)

const icons = ['cpu', 'bolt', 'wave', 'plug', 'network', 'monitor']
const defOrder = [3, 0, 5, 2, 4, 1] // significados en otro orden que los términos

const sel = ref(null) // término elegido
const matched = ref(new Set())
const status = ref('') // '' | 'right' | 'wrong'
const shake = ref(-1)
const total = computed(() => s.value.terms.length)
const won = computed(() => matched.value.size === total.value)

function pickTerm(i) {
  if (matched.value.has(i)) return
  sel.value = sel.value === i ? null : i
  status.value = ''
}
function pickDef(i) {
  if (sel.value === null || matched.value.has(i)) return
  if (sel.value === i) {
    matched.value = new Set([...matched.value, i])
    status.value = 'right'
    sel.value = null
  } else {
    status.value = 'wrong'
    shake.value = i
    setTimeout(() => (shake.value = -1), 400)
  }
}
function reset() {
  matched.value = new Set()
  sel.value = null
  status.value = ''
}
</script>

<template>
  <GuideStep :n="6" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="book">
    <p><RichText :text="s.body" /></p>

    <template #play>
      <div class="pips" role="img" :aria-label="s.progress(matched.size, total)">
        <span v-for="(_, i) in total" :key="i" class="pip" :class="{ ok: i < matched.size }"></span>
      </div>

      <div class="cols">
        <div class="lst" role="group" :aria-label="s.termsLabel">
          <button
            v-for="(g, i) in s.terms"
            :key="i"
            type="button"
            class="it term"
            :class="{ done: matched.has(i) }"
            :aria-pressed="sel === i"
            :disabled="matched.has(i)"
            @click="pickTerm(i)"
          >
            <span class="ic"><AppIcon :name="matched.has(i) ? 'check' : icons[i]" :size="20" /></span>{{ g.term }}
          </button>
        </div>
        <div class="lst" role="group" :aria-label="s.defsLabel">
          <button
            v-for="i in defOrder"
            :key="i"
            type="button"
            class="it def"
            :class="{ done: matched.has(i), 'g-shake': shake === i }"
            :disabled="matched.has(i) || sel === null"
            @click="pickDef(i)"
          >
            {{ s.terms[i].def }}
          </button>
        </div>
      </div>

      <p class="g-say" aria-live="polite">
        <template v-if="won"><AppIcon name="star" :size="18" /> {{ s.won }}</template>
        <template v-else-if="status === 'right'">{{ s.right }} {{ s.progress(matched.size, total) }}</template>
        <template v-else-if="status === 'wrong'">{{ s.wrong }}</template>
        <template v-else>{{ s.progress(matched.size, total) }}</template>
      </p>
      <p v-if="matched.size" class="act">
        <button type="button" class="btn btn-ghost" @click="reset"><AppIcon name="refresh" :size="18" />{{ s.reset }}</button>
      </p>
    </template>
  </GuideStep>
</template>

<style scoped>
.pips { display: flex; gap: 6px; margin-bottom: 12px; }
.pip { flex: 1; height: 8px; border-radius: 9px; background: var(--line); transition: background-color 0.3s ease; }
.pip.ok { background: var(--out); }
.cols { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 12px; margin-bottom: 12px; }
.lst { display: grid; gap: 8px; align-content: start; }
.it {
  display: flex; align-items: center; gap: 10px; text-align: left; min-height: 52px; padding: 10px 14px; border-radius: 14px;
  border: 2px solid var(--line); background: var(--surface); color: var(--ink); font-size: 14px; font-weight: 600; cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}
.term { font-size: 15px; font-weight: 700; }
.ic { flex: none; width: 34px; height: 34px; border-radius: 10px; background: var(--tint-blue); color: var(--blue-900); display: grid; place-items: center; }
.it:hover:not(:disabled) { transform: translateY(-2px); border-color: var(--blue-900); box-shadow: var(--shadow-lift); }
.it[aria-pressed='true'] { background: var(--blue-900); border-color: var(--blue-900); color: var(--on-accent); }
.it[aria-pressed='true'] .ic { background: rgba(255, 255, 255, 0.2); color: var(--on-accent); }
.def:disabled:not(.done) { cursor: default; opacity: 0.85; }
.it.done { background: var(--tint-out); border-color: var(--out); color: var(--ink-out); cursor: default; }
.it.done .ic { background: var(--out); color: var(--on-cta); }
.act { margin-top: 12px; }
@media (max-width: 720px) { .cols { grid-template-columns: minmax(0, 1fr); } }
</style>
