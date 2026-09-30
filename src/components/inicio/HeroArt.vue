<script setup>
import AppIcon from '../common/AppIcon.vue'

// Antes: un visor 3D placeholder ("Modelo 3D pendiente"). Se veía como algo
// roto/sin terminar justo en la primera pantalla, y esa pieza técnica ya no
// pertenece a Inicio (se movió a Guías). Esto es decorativo, no un pendiente:
// no promete contenido que falta, así que no necesita una etiqueta "pendiente".
const chips = [
  { icon: 'target', top: '6%', left: '8%' },
  { icon: 'book', top: '58%', left: '2%' },
  { icon: 'pencil', top: '14%', left: '68%' },
  { icon: 'flag', top: '64%', left: '70%' },
]
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
  background: rgba(255, 255, 255, 0.14);
}
.b2 {
  width: 130px; height: 130px; bottom: 4%; right: 12%;
  background: rgba(255, 255, 255, 0.12);
}
.ring {
  position: absolute; width: 220px; height: 220px; border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.35);
}

.chip {
  position: absolute;
  width: 46px; height: 46px; border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  display: grid; place-items: center;
  animation: float 5s ease-in-out infinite;
  transition: transform 0.2s ease, background-color 0.2s ease;
}
.chip:hover {
  transform: scale(1.18) !important;
  background: rgba(255, 255, 255, 0.3);
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
