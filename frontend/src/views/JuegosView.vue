<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import '../styles/juegos.css'
import AppIcon from '../components/common/AppIcon.vue'
import GameHero from '../components/juegos/GameHero.vue'
import GamePicker from '../components/juegos/GamePicker.vue'
import GameBeforePlay from '../components/juegos/GameBeforePlay.vue'
import GameStage from '../components/juegos/GameStage.vue'
import GameSide from '../components/juegos/GameSide.vue'
import { JUEGOS } from '../config/juegos'
import { useI18n } from '../i18n'

// Página pública: los juegos son de repaso (no guardan puntaje ni dependen de la sesión).
// Cada juego vive en Educaplay y se muestra incrustado en GameStage; los enlaces se configuran en
// src/config/juegos.js.
const { t } = useI18n()
const j = computed(() => t.value.juegos)

const option = ref(0)
const game = computed(() => JUEGOS[option.value])
const info = computed(() => j.value.games[game.value.id])
</script>

<template>
  <div class="juegos content">
    <nav class="crumbs" :aria-label="j.crumbs.label">
      <RouterLink to="/">{{ j.crumbs.home }}</RouterLink>
      <AppIcon name="chevron-right" :size="14" />
      <b aria-current="page">{{ j.crumbs.current }}</b>
    </nav>

    <GameHero />
    <GamePicker v-model="option" />

    <div class="layout">
      <div class="col">
        <Transition name="justep" mode="out-in">
          <div :key="game.id" class="juegos-panel">
            <div class="welcome">
              <span class="ico"><AppIcon :name="game.icon" :size="28" /></span>
              <div>
                <span class="badge">{{ j.panelBadge }}</span>
                <h2>{{ info.title }}</h2>
                <p>{{ info.text }}</p>
              </div>
            </div>
            <GameBeforePlay />
            <GameStage :game="game" />
          </div>
        </Transition>
      </div>

      <aside class="side">
        <GameSide :steps="info.steps" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* Mismas medidas de página que Inicio, Guías y Exámenes */
.content { padding: 28px; max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

.crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 14px; color: var(--ink-2); margin-bottom: -12px; }
.crumbs a { color: var(--ink-2); text-decoration: none; border-radius: 6px; transition: color 0.15s ease; }
.crumbs a:hover { color: var(--blue-900); text-decoration: underline; }
.crumbs b { color: var(--blue-900); font-weight: 600; }

.layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 24px; align-items: start; }
.col { min-width: 0; display: grid; gap: 18px; }
.juegos-panel { display: grid; gap: 18px; }

.welcome {
  display: flex; gap: 18px; align-items: flex-start;
  padding: 24px 28px; border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--tint-blue), var(--tint-green));
  border: 1px solid var(--welcome-line); border-left: 6px solid var(--teal-600);
}
.welcome .ico {
  flex: none; width: 56px; height: 56px; border-radius: 16px; background: var(--surface); color: var(--blue-900);
  display: grid; place-items: center;
}
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  color: var(--teal-600); background: var(--glass);
  padding: 3px 10px; border-radius: 999px; margin-bottom: 8px;
}
.welcome h2 { font-size: 24px; font-weight: 700; }
.welcome p { margin-top: 6px; color: var(--ink-2); }

.side { position: sticky; top: calc(var(--header-h) + 16px); display: grid; gap: 16px; }

.justep-enter-active, .justep-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.justep-enter-from { opacity: 0; transform: translateY(8px); }
.justep-leave-to { opacity: 0; }

@media (max-width: 1040px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .side { position: static; }
}
@media (max-width: 960px) {
  .content { padding: 16px; gap: 20px; }
}
@media (max-width: 720px) {
  .welcome { padding: 18px; }
}
</style>
