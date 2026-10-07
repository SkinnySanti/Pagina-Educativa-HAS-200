<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.m2.s5)

const running = ref(false)
const alarm = ref(false)
const count = ref(0)
const sel = ref('belt')
let timer = null

// Mientras está en marcha, el contador sube: como los datos que llegan del PLC.
watch(running, (on) => {
  clearInterval(timer)
  timer = on ? setInterval(() => checkTop(), 900) : null
})
onBeforeUnmount(() => clearInterval(timer))

function checkTop(){
  count.value++
  if (count.value >= 30) {
    raise()
  }
}

function raise() {
  alarm.value = true
  running.value = false
  sel.value = 'alarm'
}
const tags = ['belt', 'pieces', 'alarm']
const tagIcon = { belt: 'gear', pieces: 'box', alarm: 'alert' }
const tagTone = { belt: 'g-out', pieces: 'g-in', alarm: 'g-pr' }
const value = (k) => (k === 'belt' ? (running.value ? s.value.running : s.value.stopped) : k === 'pieces' ? count.value : alarm.value ? s.value.alarmOn : s.value.alarmOff)
</script>

<template>
  <GuideStep :n="5" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="monitor">
    <p><RichText :text="s.body" /></p>

    <template #play>
      <div class="hmi" role="group" :aria-label="s.panel">
        <p class="bar"><AppIcon name="monitor" :size="16" />{{ s.panel }}</p>
        <div class="tags">
          <button
            v-for="k in tags"
            :key="k"
            type="button"
            class="tag"
            :class="[`t-${k}`, { bad: k === 'alarm' && alarm, on: k === 'belt' && running }]"
            :aria-pressed="sel === k"
            @click="sel = k"
          >
            <AppIcon :name="tagIcon[k]" :size="22" :class="{ 'g-spin': k === 'belt' && running }" />
            <small>{{ s.tags[k].name }}</small>
            <b>{{ value(k) }}</b>
          </button>
        </div>
      </div>

      <p class="g-say" aria-live="polite"><b>{{ s.tags[sel].name }}:</b> {{ s.tags[sel].text }}</p>

      <p class="act">
        <button type="button" class="btn btn-primary" :disabled="running || alarm" @click="running = true">
          <AppIcon name="play" :size="18" />{{ s.start }}
        </button>
        <button type="button" class="btn btn-ghost" :disabled="!running" @click="running = false">
          <AppIcon name="stop" :size="18" />{{ s.stop }}
        </button>
        <button v-if="!alarm" type="button" class="btn btn-danger" @click="raise">
          <AppIcon name="octagon" :size="18" />{{ s.raise }}
        </button>
        <button v-else type="button" class="btn btn-ghost" @click="alarm = false">
          <AppIcon name="check" :size="18" />{{ s.ack }}
        </button>
      </p>
      <p class="hint">{{ s.hint }}</p>
    </template>
  </GuideStep>
</template>

<style scoped>
/* Pantalla oscura fija (como un panel SCADA real), con texto claro de buen contraste */
.hmi { background: #1f2f3f; color: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 20px rgba(20, 40, 80, 0.2); }
.bar { display: flex; align-items: center; gap: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 700; background: #2b3f54; color: #dbe7f3; }
.tags { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; padding: 14px; }
.tag {
  display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 8px; border-radius: 12px; cursor: pointer;
  background: #2b3f54; color: #fff; border: 2px solid transparent; transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.25s ease;
}
.tag small { font-size: 12px; color: #cfdceb; font-weight: 600; }
.tag b { font-size: 20px; line-height: 1.1; }
.tag:hover { transform: translateY(-3px); }
.tag[aria-pressed='true'] { border-color: #7fd6c6; }
.tag.on { background: #14573f; }
.tag.bad { background: #8f2a20; }
.act { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; }
.hint { margin-top: 8px; font-size: 13px; color: var(--ink-2); }
.g-spin { animation: g-spin 1.2s linear infinite; }
@media (max-width: 640px) { .tags { grid-template-columns: minmax(0, 1fr); } .act .btn { width: 100%; } }
</style>
