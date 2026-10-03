<script setup>
import { onMounted } from 'vue'
import PlaceholderBox from './PlaceholderBox.vue'
import { useI18n } from '../../i18n'

const props = defineProps({
  model: { type: String, default: null }, // ruta al .glb
  alt: { type: String, default: '' },
  hotspots: { type: Array, default: () => [] },
  label: { type: String, default: '' }, // texto del placeholder
  dark: Boolean,
})

const { lang, t } = useI18n()
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// <model-viewer> pesa bastante (incluye Three.js): solo se descarga si de verdad hay un modelo.
onMounted(() => {
  if (props.model) import('@google/model-viewer')
})
</script>

<template>
  <div class="viewer">
    <model-viewer
      v-if="model"
      :src="model"
      :alt="alt"
      :auto-rotate="reduceMotion ? undefined : ''"
      camera-controls
      shadow-intensity="1"
      loading="lazy"
    >
      <button
        v-for="(h, i) in hotspots"
        :key="i"
        class="hotspot"
        type="button"
        :slot="`hotspot-${i}`"
        :data-position="h.pos"
        :data-normal="h.normal || '0 1 0'"
        :aria-label="h.label[lang]"
      >
        <span class="hotspot-label">{{ h.label[lang] }}</span>
      </button>
    </model-viewer>

    <PlaceholderBox v-else icon="cube" :label="label" :hint="t.placeholders.model" :dark="dark" />
  </div>
</template>

<style scoped>
.viewer { width: 100%; height: 100%; min-height: 320px; display: flex; }
.viewer > * { flex: 1; }
model-viewer { min-height: 320px; background: var(--tint-blue); border-radius: 14px; }
@media (max-width: 960px) {
  .viewer, model-viewer { min-height: 260px; }
}

.hotspot {
  background: var(--surface); border: 2px solid var(--teal-600); border-radius: 50%;
  width: 22px; height: 22px; padding: 0; cursor: pointer;
  box-shadow: var(--shadow-pin);
}
.hotspot-label {
  position: absolute; left: 30px; top: -6px; width: max-content; max-width: 200px;
  background: var(--surface); color: var(--ink); font-size: 13px; text-align: left;
  padding: 8px 10px; border-radius: 10px; box-shadow: var(--shadow);
  opacity: 0; pointer-events: none; transition: opacity 0.15s;
}
.hotspot:hover .hotspot-label,
.hotspot:focus-visible .hotspot-label { opacity: 1; }
</style>
