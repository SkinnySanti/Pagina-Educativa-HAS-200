<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Panel lateral con sesión: «Tu ruta de exámenes». Cada ítem lleva a su opción.
const props = defineProps({
  option: { type: Number, required: true }, // opción abierta
  statuses: { type: Array, required: true }, // [[estado M1, estado M2] de la opción 0, [..] de la opción 1]
  completed: { type: Function, required: true }, // (opción, módulo) => boolean
  completedCount: { type: Number, default: 0 },
})
const emit = defineEmits(['select'])
const { t } = useI18n()
const e = computed(() => t.value.examenes)
const pct = computed(() => (props.completedCount / 4) * 100)
</script>

<template>
  <aside class="card toc" :aria-label="e.side.progress.title">
    <h3>{{ e.side.progress.title }}</h3>
    <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="4" :aria-valuenow="completedCount" :aria-valuetext="`${completedCount} / 4`">
      <i :style="{ width: `${pct}%` }"></i>
    </div>
    <p class="pp"><span>{{ e.side.progress.done }}</span><b>{{ completedCount }}/4</b></p>

    <template v-for="(group, o) in e.side.progress.groups" :key="o">
      <h4>{{ group }}</h4>
      <ul>
        <li
          v-for="(m, i) in e.modules"
          :key="i"
          :class="{ on: option === o, done: completed(o, i), open: statuses[o][i] === 'available' }"
        >
          <button type="button" :aria-current="option === o ? 'true' : undefined" @click="emit('select', o)">
            <span class="d">
              <AppIcon v-if="completed(o, i)" name="check" :size="14" />
              <AppIcon v-else-if="statuses[o][i] !== 'available'" name="lock" :size="12" />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <span class="tt">{{ m.tag }} · {{ m.guide }}</span>
          </button>
        </li>
      </ul>
    </template>
  </aside>
</template>

<style scoped>
.toc { padding: 20px; transition: box-shadow 0.25s ease; }
.toc:hover { box-shadow: var(--shadow-lift); }
h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
h4 { margin: 12px 0 2px; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; color: var(--ink-2); text-transform: uppercase; }
.bar { height: 8px; border-radius: 9px; background: var(--line); overflow: hidden; margin-bottom: 8px; }
.bar i { display: block; height: 100%; background: var(--grad); transition: width 0.4s ease; }
.pp { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-2); }
.pp b { color: var(--blue-900); }
ul { list-style: none; display: grid; gap: 2px; }
li button {
  display: flex; gap: 10px; align-items: center; width: 100%; text-align: left;
  background: none; border: 0; padding: 9px 8px; border-radius: 10px; cursor: pointer;
  font-size: 14px; color: var(--ink-2); line-height: 1.35; transition: background-color 0.15s ease, color 0.15s ease;
}
li button:hover { background: var(--hover); color: var(--blue-900); }
.d {
  flex: none; width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--line);
  display: grid; place-items: center; font-size: 11px; font-weight: 700; transition: transform 0.2s ease;
}
li button:hover .d { transform: scale(1.12); }
li.open .d { border-color: var(--green-cta); color: var(--green-cta); }
li.done .d { background: var(--green-cta); border-color: var(--green-cta); color: var(--on-cta); }
li.on button { background: var(--tint-blue); color: var(--blue-900); font-weight: 600; box-shadow: inset 3px 0 0 var(--blue-900); }

@media (max-width: 1040px) {
  .toc { position: static; }
}
</style>
