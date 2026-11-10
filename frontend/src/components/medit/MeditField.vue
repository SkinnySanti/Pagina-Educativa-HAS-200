<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { CAMPO } from '../../config/medit'
import { useI18n } from '../../i18n'

// Campo de aprendizaje del MEDIT recorrido como una línea de pasos que enlaza a cada módulo.
const { t } = useI18n()
const c = computed(() => t.value.medit.campo)
</script>

<template>
  <section class="card campo" aria-labelledby="me-campo-title">
    <h2 id="me-campo-title">{{ c.title }}</h2>
    <p class="lead">{{ c.text }}</p>
    <ol class="steps">
      <li v-for="(s, i) in CAMPO" :key="s.id">
        <RouterLink :to="s.to" class="step">
          <span class="num">{{ i + 1 }}</span>
          <span class="ico"><AppIcon :name="s.icon" :size="22" /></span>
          <b>{{ c.steps[s.id].title }}</b>
          <span class="txt">{{ c.steps[s.id].text }}</span>
        </RouterLink>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.campo { padding: 24px 28px; display: grid; gap: 10px; background: var(--tint-green); }
h2 { font-size: 22px; font-weight: 700; }
.lead { color: var(--ink-2); max-width: 78ch; }
.steps { list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 8px; position: relative; }
.step {
  position: relative; height: 100%; display: flex; flex-direction: column; gap: 6px; padding: 16px;
  background: var(--surface); border: 2px solid transparent; border-radius: var(--radius);
  color: inherit; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.step:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--green-cta); }
.num {
  position: absolute; top: 12px; right: 14px; font-size: 12px; font-weight: 700; color: var(--green-cta);
}
.ico {
  width: 40px; height: 40px; border-radius: 12px; background: var(--tint-green); color: var(--ink-teal);
  display: grid; place-items: center; margin-bottom: 4px;
}
b { font-size: 16px; font-weight: 700; }
.txt { font-size: 14px; line-height: 1.4; color: var(--ink-2); }

@media (max-width: 1040px) { .steps { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) {
  .campo { padding: 18px; }
  .steps { grid-template-columns: minmax(0, 1fr); }
}
</style>
