<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../components/common/AppIcon.vue'
import TutorHero from '../components/tutor/TutorHero.vue'
import TutorChat from '../components/tutor/TutorChat.vue'
import TutorSide from '../components/tutor/TutorSide.vue'
import { useI18n } from '../i18n'

// Página protegida (router: meta.requiresAuth): el backend exige sesión para /api/tutor/chat.
// La conversación vive en memoria (composables/useTutorChat.js) y se borra al cerrar sesión.
const { t } = useI18n()
const c = computed(() => t.value.tutor.crumbs)
</script>

<template>
  <div class="tutor content">
    <nav class="crumbs" :aria-label="c.label">
      <RouterLink to="/">{{ c.home }}</RouterLink>
      <AppIcon name="chevron-right" :size="14" />
      <b aria-current="page">{{ c.current }}</b>
    </nav>

    <TutorHero />

    <div class="layout">
      <div class="col"><TutorChat /></div>
      <aside class="side"><TutorSide /></aside>
    </div>
  </div>
</template>

<style scoped>
/* Mismas medidas de página que Inicio, Guías, Exámenes y Juegos */
.content { padding: 28px; max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

.crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 14px; color: var(--ink-2); margin-bottom: -12px; }
.crumbs a { color: var(--ink-2); text-decoration: none; border-radius: 6px; transition: color 0.15s ease; }
.crumbs a:hover { color: var(--blue-900); text-decoration: underline; }
.crumbs b { color: var(--blue-900); font-weight: 600; }

.layout { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 24px; align-items: start; }
.col { min-width: 0; }
.side { position: sticky; top: calc(var(--header-h) + 16px); display: grid; gap: 16px; }

@media (max-width: 1040px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .side { position: static; }
}
@media (max-width: 960px) {
  .content { padding: 16px; gap: 20px; }
}
</style>
