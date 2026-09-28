<script setup>
import Viewer3D from '../common/Viewer3D.vue'
import { HERO_MODEL } from '../../data/sections'
import { scrollToId } from '../../utils/scroll'
import { useI18n } from '../../i18n'

const { t } = useI18n()
</script>

<template>
  <section class="hero on-dark" aria-labelledby="hero-title">
    <div class="copy">
      <h1 id="hero-title">{{ t.hero.title }}</h1>
      <p>{{ t.hero.text }}</p>
      <div class="actions">
        <button class="btn btn-primary" type="button" @click="scrollToId('sec-a')">
          {{ t.hero.cta }}
        </button>
      </div>
    </div>

    <div class="media">
      <Viewer3D :model="HERO_MODEL" :alt="t.hero.modelLabel" :label="t.hero.modelLabel" dark />
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
.media > :deep(.viewer) { min-height: 300px; }

@media (max-width: 960px) {
  .hero { grid-template-columns: minmax(0, 1fr); padding: 28px; }
  .media { min-height: 0; }
}
</style>
