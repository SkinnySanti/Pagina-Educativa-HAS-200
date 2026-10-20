<script setup>
import HeroArt from './HeroArt.vue'
import { scrollToId } from '../../utils/scroll.js'
import { useI18n } from '../../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <section class="hero on-dark" aria-labelledby="hero-title">
    <div class="copy">
      <h1 id="hero-title">{{ t.hero.title }}</h1>
      <p>{{ t.hero.text }}</p>
      <div class="actions">
        <button class="btn btn-primary" type="button" @click="scrollToId('ruta-aprendizaje')">
          {{ t.hero.cta }}
        </button>
      </div>
    </div>

    <div class="media">
      <HeroArt />
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: var(--grad); color: var(--on-grad);
  border-radius: var(--radius-lg); padding: 40px;
  position: relative; overflow: hidden; isolation: isolate;
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 32px; align-items: center;
}
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
.actions { margin-top: 26px; }
.media { min-height: 300px; display: flex; align-items: center; justify-content: center; }

@media (max-width: 960px) {
  .hero { grid-template-columns: minmax(0, 1fr); padding: 28px; }
  .media { min-height: 0; }
}
</style>
