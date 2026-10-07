<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.m2.s3)

const order = ['sensor', 'plc', 'switch', 'pc', 'screen']
const pool = ['switch', 'screen', 'sensor', 'pc', 'plc'] // orden mezclado fijo
const icon = { sensor: 'eye', plc: 'cpu', switch: 'network', pc: 'laptop', screen: 'monitor' }
const tone = { sensor: 'g-in', plc: 'g-pr', switch: 'g-tl', pc: 'g-in', screen: 'g-out' }

// Se guardan claves (no textos): el idioma cambia en vivo.
const placed = ref([])
const wrong = ref(false)
const shakeKey = ref(0)
const done = computed(() => placed.value.length === order.length)

function pick(k) {
  if (done.value || placed.value.includes(k)) return
  if (k === order[placed.value.length]) {
    placed.value = [...placed.value, k]
    wrong.value = false
  } else {
    wrong.value = true
    shakeKey.value++
  }
}

// Animación final: un paquete recorre los 5 pasos.
const pos = ref(-1)
const playing = ref(false)
let timer = null
function stop() { clearInterval(timer); timer = null; playing.value = false }
function play() {
  stop()
  pos.value = 0
  playing.value = true
  timer = setInterval(() => {
    if (pos.value < order.length - 1) pos.value++
    else stop()
  }, 800)
}
function reset() { stop(); placed.value = []; wrong.value = false; pos.value = -1 }
onBeforeUnmount(stop)

const say = computed(() => {
  if (done.value) return s.value.done
  if (wrong.value) return `${s.value.wrong} ${s.value.hints[placed.value.length]}`
  if (placed.value.length) {
    const last = s.value.items[placed.value[placed.value.length - 1]]
    return `${last.name}: ${last.text}`
  }
  return s.value.hints[0]
})
</script>

<template>
  <GuideStep :n="3" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="network">
    <p><RichText :text="s.body" /></p>

    <template #play>
      <ol class="slots" :aria-label="s.slotLabel">
        <li v-for="(k, i) in order" :key="k" class="slot" :class="{ full: placed[i], hit: pos === i }">
          <template v-if="placed[i]">
            <span class="g-tile ph" :class="tone[placed[i]]">
              <span class="g-ico"><AppIcon :name="icon[placed[i]]" :size="22" /></span>
              <small>{{ s.items[placed[i]].name }}</small>
            </span>
          </template>
          <span v-else class="empty">{{ s.slot(i + 1) }}</span>
          <AppIcon v-if="i < order.length - 1" class="ar" name="chevron-right" :size="20" />
        </li>
      </ol>

      <p class="cap">{{ s.poolLabel }}</p>
      <div :key="shakeKey" class="pool" :class="{ 'g-shake': wrong }" role="group" :aria-label="s.poolLabel">
        <button
          v-for="k in pool"
          :key="k"
          type="button"
          class="g-tile pc"
          :class="tone[k]"
          :disabled="placed.includes(k)"
          @click="pick(k)"
        >
          <span class="g-ico"><AppIcon :name="icon[k]" :size="22" /></span>
          <small>{{ s.items[k].name }}</small>
        </button>
      </div>

      <p class="g-say" aria-live="polite">{{ say }}</p>

      <p class="act">
        <button v-if="done" type="button" class="btn btn-primary" :disabled="playing" @click="play">
          <AppIcon name="play" :size="18" />{{ playing ? s.playing : s.play }}
        </button>
        <button type="button" class="btn btn-ghost" :disabled="!placed.length" @click="reset">
          <AppIcon name="refresh" :size="18" />{{ s.reset }}
        </button>
      </p>
    </template>
  </GuideStep>
</template>

<style scoped>
.slots { list-style: none; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin-bottom: 14px; }
.slot { position: relative; min-height: 78px; display: grid; }
.empty {
  display: grid; place-items: center; border: 2px dashed var(--line); border-radius: 16px;
  font-size: 12.5px; font-weight: 700; color: var(--ink-2);
}
.ph { padding: 8px 4px; height: 100%; justify-content: center; }
.ph .g-ico { width: 34px; height: 34px; }
.ar { position: absolute; right: -13px; top: 50%; margin-top: -10px; color: var(--ink-2); z-index: 1; }
.slot.hit .ph { border-color: var(--c); transform: translateY(-6px) scale(1.06); box-shadow: var(--shadow-card); background: var(--surface-2); }
.slot .ph { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }

.cap { font-size: 12px; font-weight: 700; color: var(--ink-2); margin-bottom: 6px; }
.pool { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.pc { padding: 10px 14px; min-width: 104px; }
.pc:disabled { opacity: 0.3; cursor: default; transform: none; box-shadow: none; }
.act { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; }

@media (max-width: 720px) {
  .slots { grid-template-columns: minmax(0, 1fr); }
  .slot { min-height: 0; }
  .empty { padding: 14px; }
  .ar { right: auto; left: 50%; top: auto; bottom: -15px; margin: 0 0 0 -10px; transform: rotate(90deg); }
  .ph { flex-direction: row; justify-content: flex-start; padding: 8px 14px; }
}
</style>
