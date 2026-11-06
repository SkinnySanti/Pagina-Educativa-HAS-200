<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../components/common/AppIcon.vue'
import TutorHero from '../components/tutor/TutorHero.vue'
import TutorChat from '../components/tutor/TutorChat.vue'
import TutorAudios from '../components/tutor/TutorAudios.vue'
import TutorSide from '../components/tutor/TutorSide.vue'
import TutorIntroNotice from '../components/tutor/TutorIntroNotice.vue'
import TutorIntroUses from '../components/tutor/TutorIntroUses.vue'
import TutorIntroPreview from '../components/tutor/TutorIntroPreview.vue'
import TutorIntroSteps from '../components/tutor/TutorIntroSteps.vue'
import TutorIntroSide from '../components/tutor/TutorIntroSide.vue'
import { useAuth } from '../composables/useAuth'
import { useI18n } from '../i18n'

// Página REACTIVA a la sesión (como Exámenes y Retroalimentación):
//  · sin sesión → vista informativa (para qué sirve, cómo se usa) con UN botón que lleva al login y vuelve aquí;
//  · con sesión → el chat. TutorChat solo se monta con sesión, así que no hay llamadas a /api/tutor/chat sin JWT.
// La conversación vive en memoria (composables/useTutorChat.js) y se borra al cerrar sesión.
const { t } = useI18n()
const { isLoggedIn } = useAuth()
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
    <TutorIntroNotice v-if="!isLoggedIn" />

    <div class="layout">
      <div v-if="isLoggedIn" class="col">
        <TutorChat />
        <TutorAudios />
      </div>
      <div v-else class="col">
        <TutorIntroUses />
        <TutorIntroPreview />
        <TutorIntroSteps />
      </div>

      <aside class="side">
        <TutorSide v-if="isLoggedIn" />
        <TutorIntroSide v-else />
      </aside>
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
.col { min-width: 0; display: grid; gap: 24px; }
.side { position: sticky; top: calc(var(--header-h) + 16px); display: grid; gap: 16px; }

@media (max-width: 1040px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .side { position: static; }
}
@media (max-width: 960px) {
  .content { padding: 16px; gap: 20px; }
}
</style>
