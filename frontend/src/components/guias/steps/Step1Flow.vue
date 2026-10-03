<script setup>
import { computed, ref } from 'vue'
import GuideIntro from '../GuideIntro.vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.s1)

const examples = ['arepas', 'ropa', 'has']
const chipIcon = { arepas: 'food', ropa: 'shirt', has: 'factory' }
const blockIcons = { arepas: ['grain', 'flame', 'food'], ropa: ['spool', 'scissors', 'shirt'], has: ['box', 'gear', 'inbox'] }
const stages = ['in', 'pr', 'out']

const example = ref('arepas')
const selected = ref('in')
</script>

<template>
  <div class="stack">
    <GuideIntro />
    <GuideStep :n="1" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="cube">
      <p><RichText :text="s.body" /></p>

      <template #play>
        <div class="g-chips" role="group" :aria-label="s.exLabel">
          <button
            v-for="e in examples"
            :key="e"
            type="button"
            class="g-chip"
            :aria-pressed="example === e"
            @click="example = e"
          >
            <AppIcon :name="chipIcon[e]" :size="18" />{{ s.examplesNames[e] }}
          </button>
        </div>

        <div class="g-flow flow">
          <template v-for="(k, i) in stages" :key="k">
            <span v-if="i" class="g-arrow" aria-hidden="true"><AppIcon name="chevron-right" :size="26" /></span>
            <button
              type="button"
              class="g-tile tile"
              :class="`g-${k}`"
              :aria-pressed="selected === k"
              @click="selected = k"
            >
              <span class="g-ico"><AppIcon :name="blockIcons[example][i]" :size="28" /></span>
              <small>{{ s.defs[k].name }}</small>
              <span class="g-tx">{{ s.examples[example][i] }}</span>
            </button>
          </template>
        </div>

        <p class="g-say" aria-live="polite"><b>{{ s.defs[selected].name }}:</b> {{ s.defs[selected].text }}</p>
        <p class="hint">{{ s.hint }}</p>
      </template>
    </GuideStep>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: 18px; }
.flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 8px; align-items: stretch; margin-bottom: 14px; }
.tile { padding: 16px 12px; }
.hint { margin-top: 8px; font-size: 13px; color: var(--ink-2); }
</style>
