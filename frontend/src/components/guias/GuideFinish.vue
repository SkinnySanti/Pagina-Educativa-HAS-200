<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

const props = defineProps({ module: { type: String, default: 'm1' } })
const emit = defineEmits(['review', 'next'])
const { t } = useI18n()
const g = computed(() => (props.module === 'm2' ? t.value.guias.m2.finish : t.value.guias.finish))
</script>

<template>
  <article class="card done">
    <span class="trophy"><AppIcon name="star" :size="34" /></span>
    <h2 id="guia-paso" tabindex="-1">{{ g.title }}</h2>
    <p class="txt">{{ g.text }}</p>

    <h3>{{ g.listTitle }}</h3>
    <ul class="ideas">
      <li v-for="item in g.items" :key="item">
        <AppIcon name="check" :size="16" />{{ item }}
      </li>
    </ul>

    <div class="actions">
      <button type="button" class="btn btn-ghost" @click="emit('review')">
        <AppIcon name="refresh" :size="18" />{{ g.review }}
      </button>
      <RouterLink to="/" class="btn btn-primary">
        <AppIcon name="home" :size="18" />{{ g.home }}
      </RouterLink>
      <button v-if="module === 'm1'" type="button" class="btn btn-ghost" @click="emit('next')">
        {{ g.next }}<AppIcon name="chevron-right" :size="18" />
      </button>
      <button v-else type="button" class="btn btn-ghost" disabled :title="t.guias.picker.soonTitle">
        <AppIcon name="lock" :size="18" />{{ g.next }} · {{ t.guias.picker.soon }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.done { padding: 34px 28px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.trophy {
  width: 72px; height: 72px; border-radius: 20px; background: var(--grad); color: var(--on-grad);
  display: grid; place-items: center; transition: transform 0.25s ease;
}
.done:hover .trophy { transform: scale(1.08) rotate(-6deg); }
h2 { font-size: 26px; font-weight: 700; }
h2:focus { outline: none; }
.txt { color: var(--ink-2); max-width: 56ch; }
h3 { margin-top: 10px; font-size: 14px; font-weight: 600; color: var(--blue-900); }
.ideas { list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; max-width: 60ch; }
.ideas li {
  display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600;
  background: var(--tint-green); color: var(--ink-teal); padding: 6px 14px; border-radius: 999px;
  transition: transform 0.2s ease;
}
.ideas li:hover { transform: translateY(-2px); }
.actions { margin-top: 16px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
@media (max-width: 640px) { .done { padding: 26px 16px; } .actions .btn { width: 100%; } }
</style>
