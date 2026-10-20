<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { safeEmbedUrl } from '../../config/juegos'
import { useI18n } from '../../i18n'

// Escenario del juego: el juego de Educaplay se muestra DENTRO de la página (iframe), sin redirigir.
// El padre lo monta con :key="game.id", así cada juego arranca limpio.
const props = defineProps({
  game: { type: Object, required: true }, // fila de config/juegos.js
})
const { t } = useI18n()
const j = computed(() => t.value.juegos)
const info = computed(() => j.value.games[props.game.id])

const url = computed(() => safeEmbedUrl(props.game.embedUrl))
const loading = ref(!!url.value)
const runKey = ref(0) // cambiar la key vuelve a montar el iframe = "Reiniciar"
const frame = ref(null)
const canFull = typeof document !== 'undefined' && !!document.fullscreenEnabled

function reset() {
  loading.value = true
  runKey.value++
}
function fullscreen() {
  frame.value?.requestFullscreen?.()
}
</script>

<template>
  <section class="card stage" aria-labelledby="ju-stage-title">
    <div class="shead">
      <span class="ju-pill ok">{{ j.module(game.modulo) }}</span>
      <h3 id="ju-stage-title">{{ info.heading }}</h3>
      <div v-if="url" class="acts">
        <button type="button" class="btn btn-ghost sm" @click="reset"><AppIcon name="refresh" :size="16" />{{ j.stage.reset }}</button>
        <button v-if="canFull" type="button" class="btn btn-primary sm" @click="fullscreen">
          <AppIcon name="expand" :size="16" />{{ j.stage.full }}
        </button>
      </div>
    </div>

    <div ref="frame" class="frame" :style="{ '--game-h': `${game.height}px` }">
      <template v-if="url">
        <iframe
          :key="runKey"
          :src="url"
          :title="j.stage.frameTitle(info.title)"
          loading="lazy"
          allow="fullscreen"
          allowfullscreen
          @load="loading = false"
        ></iframe>
        <p v-if="loading" class="overlay" role="status"><AppIcon name="clock" :size="18" />{{ j.stage.loading }}</p>
      </template>
      <div v-else class="missing">
        <span class="ico"><AppIcon :name="game.icon" :size="28" /></span>
        <b>{{ j.stage.missingTitle }}</b>
        <p>{{ j.stage.missingText }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stage { padding: 20px; display: grid; gap: 14px; }
.shead { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.shead h3 { font-size: 19px; font-weight: 700; }
.acts { margin-left: auto; display: flex; gap: 8px; }

.frame {
  position: relative; height: var(--game-h, 560px); min-height: 420px;
  border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; background: var(--bg);
}
iframe { display: block; width: 100%; height: 100%; border: 0; }
.overlay {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--bg); color: var(--ink-2); font-weight: 600; font-size: 15px;
}
.missing { height: 100%; display: grid; place-content: center; justify-items: center; gap: 8px; padding: 24px; text-align: center; }
.missing .ico { width: 56px; height: 56px; border-radius: 16px; background: var(--tint-blue); color: var(--blue-900); display: grid; place-items: center; }
.missing b { font-size: 17px; font-weight: 700; }
.missing p { font-size: 14px; color: var(--ink-2); max-width: 40ch; }

@media (max-width: 560px) {
  .acts { margin-left: 0; width: 100%; }
  .frame { min-height: 0; height: min(var(--game-h, 560px), 70vh); }
}
</style>
