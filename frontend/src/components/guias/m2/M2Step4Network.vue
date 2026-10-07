<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.m2.s4)

const ports = ['plc', 'pc', 'free1', 'free2']
const icon = { plc: 'cpu', pc: 'laptop', free1: 'plug', free2: 'plug' }
const plugged = ref({ plc: true, pc: true, free1: false, free2: false })
const sending = ref(false)
// Estado del mensaje (no el texto) para que cambie de idioma en vivo.
const msg = ref({ key: 'idle', name: '' })
let timer = null


function toggle(k) {
  plugged.value = { ...plugged.value, [k]: !plugged.value[k] }
  msg.value = { key: plugged.value[k] ? 'plug' : 'unplug', name: k }
  sending.value = false
}
function send() {
  clearTimeout(timer)
  if (plugged.value.plc && plugged.value.pc) {
    sending.value = true
    msg.value = { key: 'sent', name: '' }
    timer = setTimeout(() => (sending.value = false), 2400)
  } else {
    msg.value = { key: 'nopath', name: '' }
  }
}
onBeforeUnmount(() => clearTimeout(timer))
const nameOf = (k) => s.value.devices[k]
// El nombre del equipo se resuelve en el idioma actual.
const shown = computed(() => {
  const m = s.value.msg[msg.value.key]
  return typeof m === 'function' ? m(nameOf(msg.value.name)) : m
})
</script>

<template>
  <GuideStep :n="4" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="plug">
    <p><RichText :text="s.body" /></p>

    <template #play>
      <div class="row" role="group" :aria-label="s.kicker">
        <div v-for="k in ports" :key="k" class="dev">
          <button type="button" class="g-tile d" :class="plugged[k] ? 'g-tl' : 'g-pr'" :aria-pressed="plugged[k]" @click="toggle(k)">
            <span class="g-ico"><AppIcon :name="icon[k]" :size="24" /></span>
            <small>{{ nameOf(k) }}</small>
          </button>
          <i class="cable" :class="{ on: plugged[k] }" aria-hidden="true"></i>
        </div>
      </div>

      <div class="sw" role="img" :aria-label="s.switchLabel">
        <span class="swl">{{ s.switchLabel }}</span>
        <div v-for="(k, i) in ports" :key="k" class="port">
          <span class="rj" :class="{ in: plugged[k] }"></span>
          <span class="leds">
            <i class="led g" :class="{ on: plugged[k] }" :title="s.link"></i>
            <i class="led a" :class="{ on: plugged[k] && sending, 'g-blink': plugged[k] && sending }" :title="s.activity"></i>
          </span>
          <small>{{ s.portLabel(i + 1) }}</small>
        </div>
      </div>

      <div class="foot">
        <p class="g-say" aria-live="polite">{{ shown }}</p>
        <button type="button" class="btn btn-primary" @click="send">
          <AppIcon name="bolt" :size="18" />{{ s.send }}
        </button>
      </div>
      <p class="leg"><i class="led g on"></i>{{ s.link }} <i class="led a on"></i>{{ s.activity }}</p>
      <p class="leg">{{ s.legend }}</p>
      <p class="leg">{{ s.legend2 }}</p>
    </template>
  </GuideStep>
</template>

<style scoped>
.row, .sw { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.dev { display: flex; flex-direction: column; align-items: center; }
.d { width: 100%; padding: 10px 6px; }
.cable { width: 0; height: 34px; border-left: 4px dashed var(--line); transition: border-color 0.25s ease; }
.cable.on { border-left: 4px solid var(--teal-600); }

.sw {
  position: relative; padding: 26px 12px 12px; border-radius: 16px; background: var(--beacon-body); color: #fff;
  box-shadow: 0 8px 20px rgba(20, 40, 80, 0.2);
}
.swl { position: absolute; top: 6px; left: 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #cfd8dc; }
.port { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.port small { font-size: 11px; color: #cfd8dc; }
.rj { width: 34px; height: 26px; border-radius: 4px; background: #1c262c; border: 2px solid #5b6b75; position: relative; }
.rj.in::after { content: ''; position: absolute; inset: 4px 5px; background: #b0bec5; border-radius: 2px; }
.leds { display: flex; gap: 6px; }
.led { width: 11px; height: 11px; border-radius: 50%; background: #4a5a64; display: inline-block; transition: background-color 0.2s ease, box-shadow 0.2s ease; }
.led.g.on { background: #34d17a; box-shadow: 0 0 8px 2px rgba(52, 209, 122, 0.7); }
.led.a.on { background: #ffc233; box-shadow: 0 0 8px 2px rgba(255, 194, 51, 0.7); }
.g-blink { animation: g-blink 0.45s linear infinite; }

.foot { margin-top: 14px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; }
.leg { margin-top: 10px; font-size: 12.5px; color: var(--ink-2); display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.leg .led.g.on, .leg .led.a.on { box-shadow: none; }

@media (max-width: 640px) {
  .foot { grid-template-columns: minmax(0, 1fr); }
  .foot .btn { width: 100%; }
  .row, .sw { gap: 6px; }
}
</style>
