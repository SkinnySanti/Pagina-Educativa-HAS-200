<script setup>
import { computed, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.s5)

const keys = ['food', 'clothes', 'cars', 'meds']
const icons = { food: 'food', clothes: 'shirt', cars: 'car', meds: 'pill' }

const industry = ref('food')
const fact = ref(false)
const item = computed(() => s.value.industries[industry.value])
</script>

<template>
  <GuideStep :n="5" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="target">
    <p>{{ s.body }}</p>

    <template #play>
      <div class="g-chips" role="group" :aria-label="s.industryLabel">
        <button v-for="k in keys" :key="k" type="button" class="g-chip" :aria-pressed="industry === k" @click="industry = k">
          <AppIcon :name="icons[k]" :size="18" />{{ s.industries[k].label }}
        </button>
      </div>

      <div class="g-flow flow" aria-live="polite">
        <div class="g-tile g-in tile">
          <span class="g-ico"><AppIcon name="inbox" :size="26" /></span>
          <small>{{ s.stage.in }}</small>
          <span class="g-tx">{{ item.in }}</span>
        </div>
        <span class="g-arrow" aria-hidden="true"><AppIcon name="chevron-right" :size="26" /></span>
        <div class="g-tile g-pr tile">
          <span class="g-ico"><AppIcon name="gear" :size="26" /></span>
          <small>{{ s.stage.pr }}</small>
          <span class="g-tx">{{ s.stage.transforms }}</span>
        </div>
        <span class="g-arrow" aria-hidden="true"><AppIcon name="chevron-right" :size="26" /></span>
        <div class="g-tile g-out tile">
          <span class="g-ico"><AppIcon :name="icons[industry]" :size="26" /></span>
          <small>{{ s.stage.out }}</small>
          <span class="g-tx">{{ item.out }}</span>
        </div>
      </div>

      <button type="button" class="btn btn-ghost" :aria-expanded="fact" aria-controls="dato" @click="fact = !fact">
        <AppIcon name="bulb" :size="18" />{{ fact ? s.fact.hide : s.fact.show }}
      </button>

      <div v-if="fact" id="dato" class="fact">
        <p>{{ s.fact.text }}</p>
        <div class="chart" role="img" :aria-label="s.fact.chart">
          <div class="row">
            <span>{{ s.fact.before }}</span>
            <div class="track"><i class="b1"></i></div>
          </div>
          <div class="row">
            <span>{{ s.fact.after }}</span>
            <div class="track"><i class="b2"></i></div>
          </div>
        </div>
      </div>
    </template>
  </GuideStep>
</template>

<style scoped>
.flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 8px; align-items: stretch; margin-bottom: 14px; }
.tile { padding: 16px 12px; }

.fact { margin-top: 14px; background: var(--tint-pr); border-radius: 14px; padding: 16px; font-size: 14.5px; animation: pop 0.3s ease; }
.fact p { color: var(--ink); }
.chart { margin-top: 14px; display: grid; gap: 10px; }
.row { display: grid; gap: 4px; font-size: 13px; font-weight: 600; color: var(--ink-pr); }
.track { height: 14px; border-radius: 9px; background: rgba(255, 255, 255, 0.8); overflow: hidden; }
.track i { display: block; height: 100%; border-radius: 9px; animation: grow 0.8s ease both; }
.b1 { width: 100%; background: var(--pr); }
.b2 { width: 12%; background: var(--out); animation-delay: 0.25s; }
@keyframes grow { from { width: 0; } }
@keyframes pop { from { opacity: 0; transform: translateY(6px); } }
</style>
