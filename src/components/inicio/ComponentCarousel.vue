<script setup>
import { ref } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import PlaceholderBox from '../common/PlaceholderBox.vue'
import { useI18n } from '../../i18n'

defineProps({
  // [{ name, desc, img: { src, alt: { es, en } } | null }]
  items: { type: Array, required: true },
})

const { lang, t } = useI18n()
const track = ref(null)

function scroll(direction) {
  const el = track.value
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
  <div class="carousel" role="region" aria-roledescription="carousel" :aria-label="t.tabs.carousel">
    <div ref="track" class="track" tabindex="0">
      <article v-for="(item, i) in items" :key="i" class="comp">
        <img v-if="item.img" :src="item.img.src" :alt="item.img.alt[lang]" loading="lazy" />
        <PlaceholderBox
          v-else
          class="comp-ph"
          :label="t.placeholders.componentImage"
          :hint="t.placeholders.image"
        />
        <h3>{{ item.name }}</h3>
        <p>{{ item.desc }}</p>
      </article>
    </div>

    <div class="controls">
      <button type="button" :aria-label="t.tabs.prev" @click="scroll(-1)"><AppIcon name="chevron-left" :size="20" /></button>
      <button type="button" :aria-label="t.tabs.next" @click="scroll(1)"><AppIcon name="chevron-right" :size="20" /></button>
    </div>
  </div>
</template>

<style scoped>
.track {
  display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px;
  scroll-snap-type: x mandatory; scrollbar-width: thin;
}
.comp {
  flex: 0 0 min(240px, 78%); scroll-snap-align: start;
  border: 1px solid var(--line); border-radius: 14px; padding: 12px; background: var(--surface);
}
.comp img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 12px; }
.comp-ph { aspect-ratio: 4 / 3; height: auto; }
h3 { font-size: 16px; margin: 12px 0 4px; }
p { font-size: 14px; color: var(--ink-2); }

.controls { display: flex; gap: 8px; justify-content: flex-end; margin-top: 10px; }
.controls button {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--surface); color: var(--blue-900);
  cursor: pointer; display: grid; place-items: center;
}
.controls button:hover { background: var(--tint-blue); }
</style>
