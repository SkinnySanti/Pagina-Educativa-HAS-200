<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'

const props = defineProps({
  // Íconos de las 4 fichas flotantes. Por defecto, los de Inicio.
  icons: { type: Array, default: () => ['target', 'book', 'pencil', 'flag'] },
})
const spots = [
  { top: '6%', left: '8%' },
  { top: '58%', left: '2%' },
  { top: '14%', left: '68%' },
  { top: '64%', left: '70%' },
]
const chips = computed(() => spots.map((s, i) => ({ ...s, icon: props.icons[i] })))
</script>

<template>
  <div class="art" role="img" aria-label="">
    <span class="blob b1"></span>
    <span class="blob b2"></span>
    <span class="ring"></span>
    <span
      v-for="(c, i) in chips"
      :key="c.icon"
      class="chip"
      :style="{ top: c.top, left: c.left, animationDelay: `${i * 0.6}s` }"
    >
      <AppIcon :name="c.icon" :size="22" />
    </span>
  </div>
</template>

<style scoped>
.art {
  position: relative; width: 100%; height: 100%; min-height: 260px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

.blob { position: absolute; border-radius: 50%; filter: blur(2px); }
.b1 {
  width: 190px; height: 190px; top: 8%; left: 20%;
  background: var(--on-grad-soft);
}
.b2 {
  width: 130px; height: 130px; bottom: 4%; right: 12%;
  background: var(--on-grad-softer);
}
.ring {
  position: absolute; width: 220px; height: 220px; border-radius: 50%;
  border: 2px dashed var(--on-grad-border);
}

.chip {
  position: absolute;
  width: 46px; height: 46px; border-radius: 14px;
  background: var(--on-grad-chip);
  border: 1px solid var(--on-grad-border);
  color: var(--on-grad);
  display: grid; place-items: center;
  animation: float 5s ease-in-out infinite;
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.chip:hover {
  transform: scale(1.18) !important;
  background: var(--on-grad-chip-hover);
  animation-play-state: paused;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 960px) {
  .art { min-height: 200px; }
}
</style>
