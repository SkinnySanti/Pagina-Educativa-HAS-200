<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { JUEGOS } from '../../config/juegos'
import { useI18n } from '../../i18n'

// Selector de juego (mismo patrón que ExamTypePicker). El orden sale de config/juegos.js.
defineProps({ modelValue: { type: Number, required: true } })
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const j = computed(() => t.value.juegos)
</script>

<template>
  <ol class="picker" :aria-label="j.picker.label">
    <li v-for="(g, i) in JUEGOS" :key="g.id">
      <button type="button" class="card mod" :aria-pressed="modelValue === i" @click="emit('update:modelValue', i)">
        <span class="ico"><AppIcon :name="g.icon" :size="24" /></span>
        <span class="txt">
          <b>{{ j.games[g.id].title }}</b>
          <span>{{ j.games[g.id].text }}</span>
        </span>
        <span class="ju-pill">{{ j.module(g.modulo) }}</span>
      </button>
    </li>
  </ol>
</template>

<style scoped>
.picker { list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
.mod {
  width: 100%; height: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 12px;
  padding: 20px; text-align: left; border: 2px solid transparent; color: inherit; cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.mod:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--tint-blue); }
.mod[aria-pressed='true'] { border-color: var(--blue-900); }
.ico {
  flex: none; width: 46px; height: 46px; border-radius: 12px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.mod:hover .ico, .mod[aria-pressed='true'] .ico { background: var(--blue-900); color: var(--on-accent); }
.mod:hover .ico { transform: scale(1.08) rotate(-6deg); }
.txt { display: flex; flex-direction: column; gap: 2px; }
.txt b { font-size: 17px; font-weight: 700; }
.txt span { font-size: 14px; color: var(--ink-2); line-height: 1.4; }
.ju-pill { margin-top: auto; }

@media (max-width: 1040px) {
  .picker { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .picker { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .mod { padding: 16px; }
}
</style>
