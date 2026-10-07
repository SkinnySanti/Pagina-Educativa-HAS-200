<script setup>
import { computed, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.m2.s2)

const dig = ref(0) // 0 | 1
const ana = ref(40) // 0–100
const level = computed(() => (ana.value < 34 ? 0 : ana.value < 67 ? 1 : 2))
</script>

<template>
  <GuideStep :n="2" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="wave">
    <p><RichText :text="s.body" /></p>

    <template #play>
      <div class="duo">
        <section class="g-tile g-in box" :aria-label="s.digital.title">
          <span class="g-ico"><AppIcon name="bolt" :size="26" /></span>
          <b>{{ s.digital.title }}</b>

          <!-- onda cuadrada: solo dos alturas -->
          <svg class="wv" viewBox="0 0 200 60" role="img" :aria-label="s.digital.title">
            <path :d="dig ? 'M0 50 H60 V10 H200' : 'M0 50 H200'" fill="none" stroke="var(--in)" stroke-width="4" stroke-linejoin="round" />
          </svg>

          <div class="bits" aria-hidden="true">
            <span :class="{ on: dig === 0 }">0</span><span :class="{ on: dig === 1 }">1</span>
          </div>
          <button type="button" class="btn btn-primary" :aria-pressed="dig === 1" @click="dig = dig ? 0 : 1">
            <AppIcon name="hand" :size="18" />{{ s.digital.btn }}: {{ dig ? s.digital.pressed : s.digital.released }}
          </button>
          <span class="g-tx" aria-live="polite">{{ s.digital.say[dig] }}</span>
          <span class="ex">{{ s.digital.ex }}</span>
        </section>

        <section class="g-tile g-pr box" :aria-label="s.analog.title">
          <span class="g-ico"><AppIcon name="wave" :size="26" /></span>
          <b>{{ s.analog.title }}</b>

          <!-- onda suave: la amplitud sigue al deslizador -->
          <svg class="wv" viewBox="0 0 200 60" role="img" :aria-label="s.analog.title">
            <path
              :d="`M0 30 C 25 ${30 - ana * 0.26}, 50 ${30 - ana * 0.26}, 75 30 S 125 ${30 + ana * 0.26}, 150 30 S 185 ${30 - ana * 0.26}, 200 30`"
              fill="none" stroke="var(--pr)" stroke-width="4" stroke-linecap="round"
            />
          </svg>

          <div class="gauge" aria-hidden="true"><i :style="{ width: `${ana}%` }"></i></div>
          <label class="sl">
            <span>{{ s.analog.slider }}: <b>{{ ana }} %</b></span>
            <input v-model.number="ana" type="range" min="0" max="100" step="1" />
          </label>
          <span class="g-tx" aria-live="polite">{{ s.analog.levels[level] }}</span>
          <span class="ex">{{ s.analog.ex }}</span>
        </section>
      </div>
    </template>
  </GuideStep>
</template>

<style scoped>
.duo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.box { padding: 16px; gap: 10px; }
.box b { font-size: 17px; }
.wv { width: 100%; height: 56px; background: var(--surface-2); border-radius: 12px; }
.bits { display: flex; gap: 10px; }
.bits span {
  width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; font-size: 22px; font-weight: 700;
  background: var(--surface-2); color: var(--ink-2); transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}
.bits span.on { background: var(--in); color: var(--on-cta); transform: scale(1.1); }
.gauge { width: 100%; height: 14px; border-radius: 9px; background: var(--surface-2); overflow: hidden; }
.gauge i { display: block; height: 100%; background: var(--pr); border-radius: 9px; transition: width 0.15s ease; }
.sl { width: 100%; display: grid; gap: 6px; font-size: 14px; font-weight: 600; }
.sl input { width: 100%; accent-color: var(--pr); }
.ex { font-size: 12.5px; color: var(--ink-2); }

@media (max-width: 720px) { .duo { grid-template-columns: minmax(0, 1fr); } }
</style>
