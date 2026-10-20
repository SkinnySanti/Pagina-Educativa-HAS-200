<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'

const props = defineProps({
  // Íconos de las fichas que orbitan el círculo. Por defecto, los de Inicio.
  icons: { type: Array, default: () => ['target', 'book', 'pencil', 'flag'] },
})

// Cada ficha se ubica POR ÁNGULO sobre el círculo (coordenadas polares), no con
// top/left en %. Así queda siempre pegada a la línea, sin importar el ancho del hero.
// Con 4 íconos: 45°, 135°, 225° y 315° (en diagonal, como antes).
const chips = computed(() => {
  const n = props.icons.length || 1
  return props.icons.map((icon, i) => ({
    icon,
    angle: 45 + (360 / n) * i,
    delay: `${(i * 0.7).toFixed(1)}s`,
  }))
})
</script>

<template>
  <div class="art" role="img" aria-label="">
    <div class="stage">
      <span class="blob b1"></span>
      <span class="blob b2"></span>

      <!-- anillo exterior punteado que gira lento + anillo principal continuo -->
      <span class="ring ring-outer"></span>
      <span class="ring ring-main"></span>

      <!-- núcleo: tres barras con los colores/estructura del logo, en vaivén -->
      <span class="core" aria-hidden="true">
        <span class="bar"></span><span class="bar"></span><span class="bar"></span>
      </span>

      <!-- órbita: las fichas viajan sobre el círculo y se mantienen derechas -->
      <div class="orbit">
        <div v-for="c in chips" :key="c.icon" class="slot" :style="{ '--a': c.angle, '--d': c.delay }">
          <div class="arm">
            <span class="chip">
              <span class="bob">
                <span class="face"><AppIcon :name="c.icon" :size="22" /></span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.art {
  position: relative; width: 100%; height: 100%; min-height: 260px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

/* Escenario cuadrado: todo se mide en cqw (% de su ancho), así el círculo,
   la órbita y las fichas escalan juntos y nunca se separan. */
.stage {
  --chip: 46px;
  --ring: 72cqw;            /* diámetro del círculo continuo */
  --radius: 36cqw;          /* radio = ring / 2 → el centro de cada ficha cae sobre la línea */
  position: relative; width: min(100%, 300px); aspect-ratio: 1;
  container-type: inline-size;
  animation: stage-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.blob { position: absolute; border-radius: 50%; filter: blur(2px); animation: drift 9s ease-in-out infinite; }
.b1 { width: 52cqw; height: 52cqw; top: 2%; left: 10%; background: var(--on-grad-soft); }
.b2 { width: 36cqw; height: 36cqw; bottom: 2%; right: 6%; background: var(--on-grad-softer); animation-delay: -4s; }

.ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; transform: translate(-50%, -50%); }
.ring-main {
  width: var(--ring); height: var(--ring);
  border: 2px solid var(--on-grad-ring);
  background: radial-gradient(circle, var(--on-grad-softer) 0%, transparent 70%);
}
.ring-outer {
  width: 92cqw; height: 92cqw;
  border: 1.5px dashed var(--on-grad-border); opacity: 0.7;
  animation: ring-spin 50s linear infinite;
}

/* Núcleo */
.core {
  position: absolute; top: 50%; left: 50%; width: 17cqw; height: 17cqw; min-width: 44px; min-height: 44px;
  transform: translate(-50%, -50%); border-radius: 50%;
  background: var(--on-grad-chip-strong); border: 1px solid var(--on-grad-border);
  display: flex; align-items: center; justify-content: center; gap: 3px;
}
.core::before {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid var(--on-grad-ring); animation: pulse 3s ease-out infinite;
}
.bar { width: 4px; height: 40%; border-radius: 2px; background: var(--on-grad); transform-origin: center; animation: eq 1.6s ease-in-out infinite; }
.bar:nth-child(2) { height: 55%; animation-delay: -0.5s; }
.bar:nth-child(3) { height: 32%; animation-delay: -1s; }

/* Órbita.
   Cada .slot ocupa TODO el escenario (inset: 0) y se apilan uno sobre otro; el último
   tapaba a los demás y era el único que recibía el hover. Por eso las capas de la
   órbita no capturan el mouse (pointer-events: none) y solo la ficha sí. */
.orbit { position: absolute; inset: 0; pointer-events: none; animation: orbit 70s linear infinite; }
.slot { position: absolute; inset: 0; pointer-events: none; transform: rotate(calc(var(--a) * 1deg)); }
.arm {
  position: absolute; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none;
  transform: translateX(var(--radius)) rotate(calc(var(--a) * -1deg));
}
.chip {
  position: absolute; width: var(--chip); height: var(--chip); pointer-events: auto;
  top: calc(var(--chip) / -2); left: calc(var(--chip) / -2);
  animation: orbit-back 70s linear infinite;      /* anula el giro: el ícono siempre queda derecho */
}
.bob { display: block; width: 100%; height: 100%; animation: float 5s ease-in-out infinite; animation-delay: var(--d); }
.face {
  width: 100%; height: 100%; border-radius: 14px;
  background: var(--on-grad-chip); border: 1px solid var(--on-grad-border); color: var(--on-grad);
  backdrop-filter: blur(4px);
  display: grid; place-items: center; cursor: default;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}
.face:hover { transform: scale(1.18); background: var(--on-grad-chip-hover); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18); }

/* Al pasar el mouse por la ilustración, la órbita se detiene para poder "tocar" las fichas */
.art:hover .orbit, .art:hover .chip { animation-play-state: paused; }

@keyframes stage-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: none; } }
@keyframes orbit { to { transform: rotate(360deg); } }
@keyframes orbit-back { to { transform: rotate(-360deg); } }
@keyframes ring-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(6px, -8px); } }
@keyframes pulse { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.1); opacity: 0; } }
@keyframes eq { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.5); } }

@media (max-width: 960px) {
  .art { min-height: 200px; }
  .stage { --chip: 40px; width: min(100%, 250px); }
}
</style>