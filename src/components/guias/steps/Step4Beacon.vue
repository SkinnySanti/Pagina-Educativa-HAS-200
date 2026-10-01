<script setup>
import { computed, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.s4)

const lamps = [
  { k: 'r', glow: 'rgba(235, 87, 87, 0.75)' },
  { k: 'y', glow: 'rgba(242, 201, 76, 0.8)' },
  { k: 'g', glow: 'rgba(39, 174, 96, 0.75)' },
]

// Se guarda el estado (no el texto) para que el mensaje cambie de idioma en vivo.
const lamp = ref('off') // 'off' | 'r' | 'y' | 'g'
const msg = ref('idle') // clave dentro de s4.messages
const latched = ref(false) // el paro de emergencia se queda activo hasta pulsar Reset

function setLamp(k) {
  lamp.value = k
  msg.value = { g: 'lampG', y: 'lampY', r: 'lampR' }[k]
}
function press(b) {
  if (b === 'start') { lamp.value = 'g'; msg.value = 'start' }
  if (b === 'stop') { lamp.value = 'r'; msg.value = 'stop' }
  if (b === 'reset') { lamp.value = 'off'; msg.value = 'reset'; latched.value = false }
  if (b === 'emg') { lamp.value = 'r'; msg.value = 'emg'; latched.value = true }
}
</script>

<template>
  <GuideStep :n="4" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="alert">
    <p><RichText :text="s.body1" /></p>
    <p><RichText :text="s.body2" /></p>

    <template #play>
      <div class="bl">
        <div class="beacon" role="group" :aria-label="s.beaconLabel">
          <span class="cap"></span>
          <div class="housing">
            <button
              v-for="l in lamps"
              :key="l.k"
              type="button"
              class="lamp"
              :class="[`l-${l.k}`, { on: lamp === l.k }]"
              :style="{ '--glow': l.glow }"
              :aria-label="s.lamps[l.k]"
              :aria-pressed="lamp === l.k"
              :disabled="latched"
              @click="setLamp(l.k)"
            />
          </div>
          <span class="pole"></span>
        </div>

        <div class="side">
          <p class="g-say" aria-live="polite">{{ s.messages[msg] }}</p>
          <p v-if="latched" class="latched"><AppIcon name="octagon" :size="18" />{{ s.latched }}</p>

          <div class="pan" role="group" :aria-label="s.panelLabel">
            <button type="button" class="btn btn-primary" :disabled="latched" @click="press('start')">
              <AppIcon name="play" :size="18" />{{ s.buttons.start }}
            </button>
            <button type="button" class="btn btn-ghost" @click="press('stop')">
              <AppIcon name="stop" :size="18" />{{ s.buttons.stop }}
            </button>
            <button type="button" class="btn btn-ghost" @click="press('reset')">
              <AppIcon name="refresh" :size="18" />{{ s.buttons.reset }}
            </button>
            <button type="button" class="btn btn-danger emg" @click="press('emg')">
              <AppIcon name="octagon" :size="20" />{{ s.buttons.emg }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </GuideStep>
</template>

<style scoped>
.bl { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 24px; align-items: center; }

.beacon { display: flex; flex-direction: column; align-items: center; }
.cap { width: 54px; height: 10px; border-radius: 6px 6px 0 0; background: #2b3a47; }
.housing {
  width: 118px; padding: 16px 0; border-radius: 28px; background: #37474f;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  box-shadow: 0 8px 20px rgba(20, 40, 80, 0.2);
}
.pole { width: 14px; height: 22px; background: #2b3a47; border-radius: 0 0 6px 6px; }
.lamp {
  width: 64px; height: 64px; border-radius: 50%; border: 3px solid #fff; padding: 0; cursor: pointer;
  opacity: 0.3; transition: opacity 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
}
.l-r { background: #eb5757; }
.l-y { background: #f2c94c; }
.l-g { background: #27ae60; }
.lamp:hover:not(:disabled) { opacity: 0.7; transform: scale(1.06); }
.lamp.on { opacity: 1; box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4), 0 0 26px 8px var(--glow); }
.lamp:disabled { cursor: not-allowed; }

.side { display: grid; gap: 12px; }
.latched {
  display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600;
  color: var(--danger); background: #fdecea; border-radius: 12px; padding: 10px 14px;
}
.pan { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.pan .btn { justify-content: center; padding-inline: 12px; }
.emg { grid-column: 1 / -1; }

@media (max-width: 640px) {
  .bl { grid-template-columns: minmax(0, 1fr); justify-items: center; }
  .side { width: 100%; }
  .pan { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
