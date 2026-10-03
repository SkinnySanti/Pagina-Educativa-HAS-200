<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Los 2 módulos de la página. Para activar el Módulo 2: available: true y
// mostrar su contenido en GuiasView (ver README).
const modules = [
  { key: 'm1', icon: 'book', available: true },
  { key: 'm2', icon: 'pencil', available: false },
]
const emit = defineEmits(['select'])
const { t } = useI18n()
const g = computed(() => t.value.guias.picker)
</script>

<template>
  <ol class="picker" :aria-label="g.label">
    <li v-for="(m, i) in modules" :key="m.key">
      <button
        type="button"
        class="card mod"
        :class="{ active: i === 0, locked: !m.available }"
        :disabled="!m.available"
        :aria-pressed="m.available ? i === 0 : undefined"
        :title="m.available ? undefined : g.soonTitle"
        @click="emit('select', m.key)"
      >
        <span class="ico"><AppIcon :name="m.icon" :size="24" /></span>
        <span class="txt">
          <b>{{ g.modules[i].title }}</b>
          <span>{{ g.modules[i].text }}</span>
        </span>
        <span class="state" :class="{ here: m.available }">
          <AppIcon :name="m.available ? 'check' : 'lock'" :size="14" />
          {{ m.available ? g.here : g.soon }}
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
.mod:hover:not(:disabled) {
  transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--tint-blue);
}
.mod.active { border-color: var(--blue-900); }
.mod.locked { cursor: not-allowed; }
.ico {
  flex: none; width: 46px; height: 46px; border-radius: 12px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.mod:hover:not(:disabled) .ico, .mod.active .ico { background: var(--blue-900); color: var(--on-accent); }
.mod:hover:not(:disabled) .ico { transform: scale(1.08); }
.txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.txt b { font-size: 17px; font-weight: 700; }
.txt span { font-size: 14px; color: var(--ink-2); line-height: 1.4; }
.state {
  flex: none; display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
  background: var(--tint-blue); color: var(--blue-900);
}
.state.here { background: var(--tint-green); color: var(--ink-teal); }

@media (max-width: 720px) {
  .picker { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .mod { padding: 16px; }
  .state { align-self: flex-start; }
}
</style>
