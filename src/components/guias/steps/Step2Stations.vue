<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.s2)

const icons = ['inbox', 'flow', 'gear', 'box']
const tones = ['g-in', 'g-tl', 'g-pr', 'g-out']

const active = ref(0)
const playing = ref(false)
let timer = null

function stop() {
  clearInterval(timer)
  timer = null
  playing.value = false
}
function pick(i) {
  stop()
  active.value = i
}
function play() {
  stop()
  active.value = 0
  playing.value = true
  timer = setInterval(() => {
    if (active.value < icons.length - 1) active.value++
    else stop()
  }, 1100)
}
onBeforeUnmount(stop)
</script>

<template>
  <GuideStep :n="2" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="eye">
    <p>{{ s.body1 }}</p>
    <p>{{ s.body2 }}</p>

    <template #play>
      <div class="st">
        <button
          v-for="(st, i) in s.stations"
          :key="i"
          type="button"
          class="g-tile stb"
          :class="tones[i]"
          :aria-pressed="active === i"
          @click="pick(i)"
        >
          <span class="g-ico"><AppIcon :name="icons[i]" :size="26" /></span>
          <small>{{ s.stationWord }} {{ i + 1 }}</small>
          <span class="nm">{{ st.name }}</span>
        </button>
      </div>

      <div class="belt" role="img" :aria-label="s.beltLabel">
        <span class="pc" :style="{ left: `${active * 25 + 12.5}%` }"><AppIcon name="box" :size="16" /></span>
      </div>

      <p class="g-say" aria-live="polite"><b>{{ s.stations[active].name }}:</b> {{ s.stations[active].text }}</p>

      <p class="act">
        <button type="button" class="btn btn-primary" :disabled="playing" @click="play">
          <AppIcon name="play" :size="18" />{{ playing ? s.playing : s.play }}
        </button>
      </p>
    </template>
  </GuideStep>
</template>

<style scoped>
.st { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.stb { padding: 14px 10px; }
.stb .nm { font-size: 14px; font-weight: 700; line-height: 1.25; color: var(--ink); }
.stb[aria-pressed='true'] { transform: translateY(-4px); box-shadow: 0 10px 22px rgba(20, 40, 80, 0.14); }

.belt {
  position: relative; height: 34px; border-radius: 12px; background-color: var(--line); margin: 14px 0 12px;
  background-image: radial-gradient(circle, #9aa5b8 5px, transparent 6px); background-size: 8.333% 100%;
}
.pc {
  position: absolute; top: 3px; width: 28px; height: 28px; margin-left: -14px; border-radius: 8px;
  background: var(--pr); color: #fff; border: 3px solid #fff; display: grid; place-items: center;
  transition: left 0.7s ease; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}
.act { margin-top: 14px; }

@media (max-width: 720px) { .st { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
