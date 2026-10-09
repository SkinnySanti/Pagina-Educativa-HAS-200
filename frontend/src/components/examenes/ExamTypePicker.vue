<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Las 2 opciones de examen. statuses[i] = 'available' | 'locked' | 'login' (ver useExamAccess).
const props = defineProps({
  modelValue: { type: Number, required: true },
  statuses: { type: Array, required: true },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const e = computed(() => t.value.examenes)
const icons = ['target', 'flag']
</script>

<template>
  <ol class="picker" :aria-label="e.picker.label">
    <li v-for="(o, i) in e.picker.options" :key="i">
      <button
        type="button"
        class="card mod"
        :aria-pressed="modelValue === i"
        @click="emit('update:modelValue', i)"
      >
        <span class="ico"><AppIcon :name="icons[i]" :size="24" /></span>
        <span class="txt">
          <b>{{ o.title }}</b>
          <span>{{ o.text }}</span>
        </span>
        <span class="ex-state" :class="{ ok: props.statuses[i] === 'available' }">
          <AppIcon :name="props.statuses[i] === 'available' ? 'check' : 'lock'" :size="14" />
          {{ e.state[props.statuses[i]] }}
        </span>
      </button>
    </li>
  </ol>
</template>

<style scoped>
.picker { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.mod {
  width: 100%; display: flex; align-items: center; gap: 16px; padding: 18px 22px; text-align: left;
  border: 2px solid transparent; color: inherit; cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.mod:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--tint-blue); }
.mod[aria-pressed='true'] { border-color: var(--blue-900); }
.ico {
  flex: none; width: 46px; height: 46px; border-radius: 12px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.mod:hover .ico, .mod[aria-pressed='true'] .ico { background: var(--blue-900); color: var(--on-accent); }
.mod:hover .ico { transform: scale(1.08); }
.txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.txt b { font-size: 17px; font-weight: 700; }
.txt span { font-size: 14px; color: var(--ink-2); line-height: 1.4; }

@media (max-width: 720px) {
  .picker { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .mod { padding: 16px; }
  .ex-state { align-self: flex-start; }
}
</style>
