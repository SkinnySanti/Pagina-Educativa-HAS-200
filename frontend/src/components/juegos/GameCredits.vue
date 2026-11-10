<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { safeEmbedUrl } from '../../config/juegos'
import { useI18n } from '../../i18n'

// Créditos de Educaplay + referencia (estilo APA 7) del juego seleccionado.
// No toca el iframe: la marca de Educaplay dentro del juego se deja tal cual la entrega la plataforma.
const props = defineProps({
  game: { type: Object, required: true }, // fila de config/juegos.js
})
const { t } = useI18n()
const c = computed(() => t.value.juegos.credits)
const info = computed(() => t.value.juegos.games[props.game.id])
const url = computed(() => safeEmbedUrl(props.game.embedUrl))
</script>

<template>
  <section class="card credits" aria-labelledby="ju-credits-title">
    <span class="ico"><AppIcon name="globe" :size="20" /></span>
    <div class="body">
      <h3 id="ju-credits-title">{{ c.title }}</h3>
      <p>
        {{ c.text }}
        <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">{{ c.open }}</a>
      </p>
      <p class="ref">
        <span class="ref-label">{{ c.refLabel }}</span>
        {{ c.author }}. ({{ c.year }}). <i>{{ info.refTitle }}</i> [{{ c.kind }}]. {{ c.site }}.
        <template v-if="url">{{ url }}</template>
      </p>
    </div>
  </section>
</template>

<style scoped>
.credits { display: flex; gap: 14px; align-items: flex-start; padding: 16px 20px; background: var(--tint-blue); }
.ico {
  flex: none; width: 36px; height: 36px; border-radius: 10px; background: var(--surface); color: var(--blue-900);
  display: grid; place-items: center;
}
.body { min-width: 0; display: grid; gap: 8px; }
h3 { font-size: 15px; font-weight: 700; }
p { font-size: 13.5px; line-height: 1.5; color: var(--ink-2); }
a { color: var(--blue-900); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; white-space: nowrap; }
a:hover { text-decoration-thickness: 2px; }

/* Referencia con sangría francesa, como pide APA 7 */
.ref { padding-left: 1.6em; text-indent: -1.6em; overflow-wrap: anywhere; color: var(--ink); }
.ref-label {
  display: inline-block; text-indent: 0; margin-right: 6px; padding: 1px 8px; border-radius: 999px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.02em; background: var(--surface); color: var(--blue-900);
}
</style>
