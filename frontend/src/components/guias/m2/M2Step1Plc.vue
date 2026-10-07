<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import GuideIntro from '../GuideIntro.vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.m2.s1)

// Reto: tú cambias las entradas y el "PLC" decide las salidas con una regla simple.
const piece = ref(false)
const emg = ref(false)
const running = computed(() => piece.value && !emg.value)
const lamp = computed(() => (emg.value ? 'r' : running.value ? 'g' : 'off'))
const msg = computed(() => (emg.value ? s.value.msg.emg : running.value ? s.value.msg.run : s.value.msg.idle))

// El ciclo de 3 pasos se resalta en bucle, como el escaneo real del PLC.
const phase = ref(0)
let timer = null
onMounted(() => { timer = setInterval(() => (phase.value = (phase.value + 1) % 3), 900) })
onBeforeUnmount(() => clearInterval(timer))
const cycleIcons = ['eye', 'cpu', 'bolt']
</script>

<template>
  <div class="stack">
    <GuideIntro module="m2" />
    <GuideStep :n="1" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="cpu">
      <p><RichText :text="s.body" /></p>

      <template #play>
        <ol class="cycle" :aria-label="s.cycleLabel">
          <li v-for="(c, i) in s.cycle" :key="i" class="g-tile g-tl step" :class="{ live: phase === i }">
            <span class="g-ico"><AppIcon :name="cycleIcons[i]" :size="22" /></span>
            <small>{{ i + 1 }}. {{ c }}</small>
          </li>
        </ol>

        <p class="rule"><AppIcon name="gear" :size="18" />{{ s.rule }}</p>

        <div class="g-flow sim">
          <div class="col">
            <p class="cap">{{ s.inputs }}</p>
            <button type="button" class="g-tile g-in btn-in" :aria-pressed="piece" @click="piece = !piece">
              <span class="g-ico"><AppIcon name="eye" :size="24" /></span>
              <span class="g-tx">{{ s.piece }}</span>
            </button>
            <button type="button" class="g-tile g-pr btn-in" :aria-pressed="emg" @click="emg = !emg">
              <span class="g-ico"><AppIcon name="octagon" :size="24" /></span>
              <span class="g-tx">{{ s.emg }}</span>
            </button>
          </div>

          <span class="g-arrow" aria-hidden="true"><AppIcon name="chevron-right" :size="26" /></span>

          <div class="plc" aria-hidden="true">
            <AppIcon name="cpu" :size="44" />
            <b>{{ s.plc }}</b>
          </div>

          <span class="g-arrow" aria-hidden="true"><AppIcon name="chevron-right" :size="26" /></span>

          <div class="col" aria-live="polite">
            <p class="cap">{{ s.outputs }}</p>
            <div class="g-tile g-out out">
              <span class="g-ico"><AppIcon class="g-spin" :class="{ spin: running }" name="gear" :size="24" /></span>
              <small>{{ s.motor }}</small>
              <span class="g-tx">{{ running ? s.motorOn : s.motorOff }}</span>
            </div>
            <div class="g-tile g-tl out">
              <span class="dot" :class="`l-${lamp}`"></span>
              <small>{{ s.beacon }}</small>
            </div>
          </div>
        </div>

        <p class="g-say" aria-live="polite">{{ msg }}</p>
      </template>
    </GuideStep>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: 18px; }
.cycle { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
.step { padding: 12px 8px; opacity: 0.6; transition: opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease; }
.step.live { opacity: 1; border-color: var(--c); transform: translateY(-3px); }
.rule { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--ink-teal); margin-bottom: 12px; }

.sim { display: grid; grid-template-columns: 1fr auto 0.7fr auto 1fr; gap: 8px; align-items: center; margin-bottom: 14px; }
.col { display: grid; gap: 8px; align-content: start; }
.cap { font-size: 12px; font-weight: 700; color: var(--ink-2); }
.btn-in, .out { padding: 10px 8px; }
.btn-in .g-ico, .out .g-ico { width: 40px; height: 40px; }
.plc {
  display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 18px 8px; border-radius: 18px;
  background: var(--grad); color: var(--on-grad);
}
.spin { animation: g-spin 1.2s linear infinite; }
.dot { width: 26px; height: 26px; border-radius: 50%; border: 3px solid #fff; background: var(--dot); transition: background-color 0.25s ease, box-shadow 0.25s ease; }
.dot.l-g { background: var(--lamp-g); box-shadow: 0 0 14px 4px rgba(39, 174, 96, 0.6); }
.dot.l-r { background: var(--lamp-r); box-shadow: 0 0 14px 4px rgba(235, 87, 87, 0.6); }

@media (max-width: 720px) { .cycle { grid-template-columns: minmax(0, 1fr); } }
</style>
