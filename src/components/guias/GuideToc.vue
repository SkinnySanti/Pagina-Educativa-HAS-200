<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

const props = defineProps({
  current: { type: Number, required: true },
  seen: { type: Object, required: true }, // Set con los pasos leídos
  finished: Boolean,
})
const emit = defineEmits(['go'])
const { t } = useI18n()
const g = computed(() => t.value.guias)
const total = computed(() => g.value.toc.steps.length)
const pct = computed(() => (props.seen.size / total.value) * 100)

// En pantallas angostas la lista se desliza: se centra el paso actual.
const list = ref(null)
watch(
  () => [props.current, props.finished],
  async () => {
    await nextTick()
    const ol = list.value
    const el = ol?.querySelector('li.on')
    if (!el || ol.scrollWidth <= ol.clientWidth) return
    ol.scrollTo({ left: el.offsetLeft - ol.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  },
  { immediate: true },
)
</script>

<template>
  <aside class="card toc" :aria-label="g.toc.title">
    <h3>{{ g.toc.title }}</h3>
    <div
      class="bar"
      role="progressbar"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-valuenow="seen.size"
      :aria-valuetext="`${seen.size} / ${total}`"
    >
      <i :style="{ width: `${pct}%` }"></i>
    </div>
    <p class="pp">
      <span>{{ finished ? g.toc.complete : g.stepOf(current + 1, total) }}</span>
      <b>{{ seen.size }}/{{ total }}</b>
    </p>

    <ol ref="list">
      <li v-for="(title, i) in g.toc.steps" :key="i" :class="{ on: i === current && !finished, done: seen.has(i) }">
        <button type="button" :aria-current="i === current && !finished ? 'step' : undefined" @click="emit('go', i)">
          <span class="d">
            <AppIcon v-if="seen.has(i)" name="check" :size="14" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span class="tt">{{ title }}</span>
          <span v-if="seen.has(i)" class="visually-hidden">({{ g.toc.readSuffix }})</span>
        </button>
      </li>
    </ol>
  </aside>
</template>

<style scoped>
.toc {
  position: sticky; top: calc(var(--header-h) + 16px); padding: 20px;
  transition: box-shadow 0.25s ease;
}
.toc:hover { box-shadow: 0 8px 22px rgba(20, 40, 80, 0.1); }
h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
.bar { height: 8px; border-radius: 9px; background: var(--line); overflow: hidden; margin-bottom: 8px; }
.bar i { display: block; height: 100%; background: var(--grad); transition: width 0.4s ease; }
.pp { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-2); margin-bottom: 10px; }
.pp b { color: var(--blue-900); }

ol { list-style: none; display: grid; gap: 2px; position: relative; }
li button {
  position: relative; display: flex; gap: 10px; align-items: flex-start; width: 100%; text-align: left;
  background: none; border: 0; padding: 9px 8px; border-radius: 10px; cursor: pointer;
  font-size: 14px; color: var(--ink-2); line-height: 1.35; transition: background-color 0.15s ease, color 0.15s ease;
}
li button:hover { background: #f5f8fd; color: var(--blue-900); }
.d {
  flex: none; width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--line);
  display: grid; place-items: center; font-size: 11px; font-weight: 700; transition: transform 0.2s ease;
}
li button:hover .d { transform: scale(1.12); }
li.done .d { background: var(--green-cta); border-color: var(--green-cta); color: #fff; }
li.on button { background: var(--tint-blue); color: var(--blue-900); font-weight: 600; box-shadow: inset 3px 0 0 var(--blue-900); }
li.on .d { background: var(--blue-900); border-color: var(--blue-900); color: #fff; }

@media (max-width: 1040px) {
  .toc { position: static; }
  /* en pantallas angostas la lista pasa a una fila que se desliza */
  ol { display: flex; overflow-x: auto; gap: 6px; padding-bottom: 4px; }
  li { flex: none; }
  li button { white-space: nowrap; align-items: center; background: var(--bg); }
  li.on button { box-shadow: none; }
}
</style>
