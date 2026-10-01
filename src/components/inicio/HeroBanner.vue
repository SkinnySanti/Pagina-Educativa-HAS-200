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
  background: var(--grad); color: #fff;
  border-radius: var(--radius-lg); padding: 40px;
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 32px; align-items: center;
}
h1 { font-size: clamp(28px, 4vw, 42px); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
p { margin-top: 14px; font-size: 17px; max-width: 46ch; color: #eaf4ff; }
.actions { margin-top: 26px; }
.media { min-height: 300px; display: flex; }

@media (max-width: 960px) {
  .hero { grid-template-columns: minmax(0, 1fr); padding: 28px; }
  .media { min-height: 0; }
}
</style>
