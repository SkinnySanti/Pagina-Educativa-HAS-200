<script setup>
import { computed } from 'vue'
import HeroArt from '../inicio/HeroArt.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const h = computed(() => t.value.tutor.hero)
</script>

<template>
  <section class="hero on-dark" aria-labelledby="tutor-title">
    <div class="copy">
      <span class="badge">{{ h.badge }}</span>
      <h1 id="tutor-title">{{ h.title }}</h1>
      <p>{{ h.text }}</p>
      <ul class="chips">
        <li v-for="c in h.chips" :key="c">{{ c }}</li>
      </ul>
    </div>
    <div class="media"><HeroArt :icons="['robot', 'book', 'chat', 'target']" /></div>
  </section>
</template>

<style scoped>
/* Mismas medidas que el banner de Inicio, Guías y Exámenes */
.hero {
  background: var(--grad); color: var(--on-grad);
  border-radius: var(--radius-lg); padding: 40px;
  position: relative; overflow: hidden; isolation: isolate;
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 32px; align-items: center;
}
.badge {
  display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700;
  background: var(--on-grad-chip-strong); padding: 4px 12px; border-radius: 999px; margin-bottom: 14px;
}
.badge::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor;
  animation: blink 2.4s ease-in-out infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
/* Brillos suaves de fondo (no cambian el degradado de marca) */
.hero::before {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(55% 80% at 88% 15%, rgba(255, 255, 255, 0.14), transparent 65%),
    radial-gradient(40% 60% at 4% 105%, rgba(255, 255, 255, 0.08), transparent 65%);
}
/* Entrada escalonada del texto */
.copy > * { animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.copy > :nth-child(2) { animation-delay: 0.08s; }
.copy > :nth-child(3) { animation-delay: 0.16s; }
.copy > :nth-child(4) { animation-delay: 0.24s; }
@keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
h1 { text-wrap: balance; }
h1 { font-size: clamp(28px, 4vw, 42px); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
p { text-wrap: pretty; margin-top: 14px; font-size: 17px; max-width: 46ch; color: var(--on-grad-muted); }
.chips { list-style: none; margin-top: 22px; display: flex; flex-wrap: wrap; gap: 8px; }
.chips li {
  font-size: 13px; font-weight: 600; background: var(--on-grad-chip);
  padding: 5px 12px; border-radius: 999px; transition: background-color 0.2s ease, transform 0.2s ease;
}
.chips li:hover { background: var(--on-grad-chip-hover); transform: translateY(-2px); }
.media { min-height: 260px; display: flex; align-items: center; justify-content: center; }

@media (max-width: 960px) {
  .hero { grid-template-columns: minmax(0, 1fr); padding: 28px; }
  .media { min-height: 0; }
}
</style>
