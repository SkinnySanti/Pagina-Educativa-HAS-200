<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../components/common/AppIcon.vue'
import MeditHero from '../components/medit/MeditHero.vue'
import MeditAbout from '../components/medit/MeditAbout.vue'
import MeditIntegration from '../components/medit/MeditIntegration.vue'
import MeditField from '../components/medit/MeditField.vue'
import MeditResources from '../components/medit/MeditResources.vue'
import { useI18n } from '../i18n'

// Página pública e informativa: qué es el MEDIT de la UdeC y cómo se integró en la plataforma.
// Los textos están en src/i18n/medit.es.js y medit.en.js; los enlaces y las rutas, en src/config/medit.js.
const { t } = useI18n()
const m = computed(() => t.value.medit)
</script>

<template>
  <div class="medit content">
    <nav class="crumbs" :aria-label="m.crumbs.label">
      <RouterLink to="/">{{ m.crumbs.home }}</RouterLink>
      <AppIcon name="chevron-right" :size="14" />
      <b aria-current="page">{{ m.crumbs.current }}</b>
    </nav>

    <MeditHero />
    <MeditAbout />
    <MeditIntegration />
    <MeditField />
    <MeditResources />
  </div>
</template>

<style scoped>
/* Mismas medidas de página que Inicio, Guías, Exámenes y Juegos */
.content { padding: 28px; max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

.crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 14px; color: var(--ink-2); margin-bottom: -12px; }
.crumbs a { color: var(--ink-2); text-decoration: none; border-radius: 6px; transition: color 0.15s ease; }
.crumbs a:hover { color: var(--blue-900); text-decoration: underline; }
.crumbs b { color: var(--blue-900); font-weight: 600; }

@media (max-width: 960px) {
  .content { padding: 16px; gap: 20px; }
}
</style>
