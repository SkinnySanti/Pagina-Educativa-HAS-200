<script setup>
import { computed } from 'vue'
import HeroArt from '../inicio/HeroArt.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const h = computed(() => t.value.examenes.hero)
</script>

<template>
  <section class="hero on-dark" aria-labelledby="exam-title">
    <div class="copy">
      <span class="badge">{{ h.badge }}</span>
      <h1 id="exam-title">{{ h.title }}</h1>
      <p>{{ h.text }}</p>
      <ul class="chips">
        <li v-for="c in h.chips" :key="c">{{ c }}</li>
      </ul>
    </div>
    <div class="media"><HeroArt :icons="['clipboard', 'target', 'pencil', 'flag']" /></div>
  </section>
</template>

<style scoped>
/* Mismas medidas que el banner de Inicio y Guías */
.hero {
  background: var(--grad); color: var(--on-grad);
  border-radius: var(--radius-lg); padding: 40px;
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 32px; align-items: center;
}
.badge {
  display: inline-block; font-size: 12px; font-weight: 700;
  background: var(--on-grad-chip-strong); padding: 4px 12px; border-radius: 999px; margin-bottom: 14px;
}
h1 { font-size: clamp(28px, 4vw, 42px); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
p { margin-top: 14px; font-size: 17px; max-width: 46ch; color: var(--on-grad-muted); }
.chips { list-style: none; margin-top: 22px; display: flex; flex-wrap: wrap; gap: 8px; }
.chips li {
  font-size: 13px; font-weight: 600; background: var(--on-grad-chip);
  padding: 5px 12px; border-radius: 999px; transition: background-color 0.2s ease, transform 0.2s ease;
}
.chips li:hover { background: var(--on-grad-chip-hover); transform: translateY(-2px); }
.media { min-height: 220px; display: flex; }

@media (max-width: 960px) {
  .hero { grid-template-columns: minmax(0, 1fr); padding: 28px; }
  .media { min-height: 0; }
}
</style>
