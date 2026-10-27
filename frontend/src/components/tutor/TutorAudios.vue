<script setup>
import { computed, reactive, watch } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { GUIDE_AUDIOS, audioSrc } from '../../config/audios'
import { useI18n } from '../../i18n'

// Card "Escucha las guías" (debajo del chat): un reproductor propio por guía + transcripción desplegable.
// El <audio> es nativo pero va sin controles; los controles (play/pausa, barra, tiempo) son de la plataforma.
const { t, lang } = useI18n()
const a = computed(() => t.value.tutor.audios)
// Si falta el archivo del idioma activo, se cae al español (ver `onError`).
const useFallback = reactive({})
const srcOf = (g) => (useFallback[g.id] && lang.value !== 'es' ? g.src.es : audioSrc(g, lang.value))

// Estado por audio: { playing, current, duration, loading, failed }
const st = reactive(Object.fromEntries(GUIDE_AUDIOS.map((g) => [g.id, { playing: false, current: 0, duration: 0, loading: false, failed: false }])))
const players = {}
const setPlayer = (id) => (el) => { if (el) players[id] = el }

const fmt = (s) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
const pct = (id) => (st[id].duration ? Math.min(100, (st[id].current / st[id].duration) * 100) : 0)

async function toggle(id) {
  const el = players[id]
  if (!el) return
  if (!el.paused) return el.pause()
  // Solo suena uno a la vez.
  for (const [key, other] of Object.entries(players)) if (key !== id && !other.paused) other.pause()
  st[id].failed = false
  try { await el.play() } catch { st[id].failed = true } // archivo ausente o bloqueado por el navegador
}

function seek(id, value) {
  const el = players[id]
  if (!el || !st[id].duration) return
  el.currentTime = Number(value)
  st[id].current = el.currentTime
}

// Al cambiar de idioma: se detiene lo que suene y cada reproductor vuelve a 0:00 con el audio del nuevo idioma.
watch(lang, () => {
  for (const g of GUIDE_AUDIOS) {
    players[g.id]?.pause()
    useFallback[g.id] = false
    Object.assign(st[g.id], { playing: false, current: 0, duration: 0, loading: false, failed: false })
  }
}, { flush: 'pre' })

const on = {
  meta: (id, e) => { st[id].duration = e.target.duration || 0; st[id].failed = false },
  time: (id, e) => { st[id].current = e.target.currentTime },
  play: (id) => { st[id].playing = true },
  pause: (id) => { st[id].playing = false },
  ended: (id) => { st[id].playing = false; st[id].current = 0 },
  wait: (id) => { st[id].loading = true },
  ready: (id) => { st[id].loading = false },
  error: (id) => {
    const g = GUIDE_AUDIOS.find((x) => x.id === id)
    if (lang.value !== 'es' && !useFallback[id] && g.src[lang.value]) { useFallback[id] = true; return } // prueba con el audio en español
    st[id].failed = true; st[id].playing = false; st[id].loading = false
  },
}
</script>

<template>
  <section class="card audios" aria-labelledby="tu-audio-title">
    <header class="top">
      <h2 id="tu-audio-title"><AppIcon name="wave" :size="20" /> {{ a.title }}</h2>
    </header>

    <div class="body">
      <p class="lead">{{ a.lead }}</p>
      <p v-if="a.langNote" class="langnote">{{ a.langNote }}</p>

      <ul>
        <li v-for="(g, i) in GUIDE_AUDIOS" :key="g.id" class="item">
          <div class="head">
            <span class="num" aria-hidden="true">{{ i + 1 }}</span>
            <div class="txt">
              <h3>{{ a.items[i].title }}</h3>
              <p>{{ a.items[i].text }}</p>
            </div>
          </div>

          <audio
            :ref="setPlayer(g.id)"
            :src="srcOf(g)"
            preload="metadata"
            @loadedmetadata="on.meta(g.id, $event)"
            @timeupdate="on.time(g.id, $event)"
            @play="on.play(g.id)"
            @pause="on.pause(g.id)"
            @ended="on.ended(g.id)"
            @waiting="on.wait(g.id)"
            @canplay="on.ready(g.id)"
            @error="on.error(g.id)"
          ></audio>

          <div class="player" :class="{ playing: st[g.id].playing }">
            <button
              type="button"
              class="pp"
              :aria-label="`${st[g.id].playing ? a.pause : a.play}: ${a.items[i].title}`"
              :aria-pressed="st[g.id].playing"
              @click="toggle(g.id)"
            >
              <span v-if="st[g.id].loading && st[g.id].playing" class="spin" aria-hidden="true"></span>
              <svg v-else-if="st[g.id].playing" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4.2" height="14" rx="1.3" /><rect x="13.8" y="5" width="4.2" height="14" rx="1.3" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z" />
              </svg>
            </button>

            <div class="track">
              <input
                type="range"
                min="0"
                step="0.1"
                :max="st[g.id].duration || 0"
                :value="st[g.id].current"
                :disabled="!st[g.id].duration"
                :aria-label="`${a.seek}: ${a.items[i].title}`"
                :aria-valuetext="`${fmt(st[g.id].current)} / ${fmt(st[g.id].duration)}`"
                :style="{ '--p': pct(g.id) + '%' }"
                @input="seek(g.id, $event.target.value)"
              />
              <span class="time">{{ fmt(st[g.id].current) }} / {{ st[g.id].duration ? fmt(st[g.id].duration) : a.duration(g.minutes) }}</span>
            </div>
          </div>

          <p v-if="useFallback[g.id] && lang !== 'es' && !st[g.id].failed" class="fb" role="status">{{ a.fallback }}</p>

          <p v-if="st[g.id].failed" class="warn" role="alert">
            <AppIcon name="alert" :size="16" /><span>{{ a.unavailable }}</span>
          </p>

          <details class="tr">
            <summary>{{ a.transcript }}</summary>
            <div :lang="a.transcriptLang">
              <p v-for="(p, k) in a.items[i].transcript" :key="k">{{ p }}</p>
            </div>
          </details>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* Misma estructura que la card del chat: sin padding propio, cabecera con borde inferior y cuerpo de 20px. */
.audios { padding: 0; overflow: hidden; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--line); }
.top h2 { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--blue-900); }
.body { padding: 20px; display: grid; gap: 14px; }
.lead { font-size: 14.5px; color: var(--ink-2); line-height: 1.5; }
.langnote { font-size: 12.5px; color: var(--ink-in); background: var(--tint-blue); padding: 6px 12px; border-radius: 10px; width: fit-content; }

ul { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
.item { display: grid; gap: 14px; padding: 16px; border: 1px solid var(--line); border-radius: 14px; background: var(--surface); min-width: 0; }
.head { display: flex; align-items: flex-start; gap: 10px; }
.num {
  flex: none; width: 30px; height: 30px; border-radius: 50%; background: var(--tint-green); color: var(--ink-teal);
  display: grid; place-items: center; font-size: 13px; font-weight: 800;
}
.txt { min-width: 0; }
.txt h3 { font-size: 15px; font-weight: 700; line-height: 1.3; }
.txt p { margin-top: 2px; font-size: 13px; color: var(--ink-2); line-height: 1.4; }
audio { display: none; }

/* Reproductor */
.player { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; background: var(--tint-blue); }
.pp {
  flex: none; width: 44px; height: 44px; border-radius: 14px; border: 2px solid var(--on-grad-border); cursor: pointer;
  display: grid; place-items: center; background: var(--green-cta); color: var(--on-cta);
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
}
.pp:hover { background: var(--green-cta-hover); transform: translateY(-1px); box-shadow: var(--shadow-primary); }
.pp:active { transform: none; }
.player.playing .pp { background: var(--blue-900); color: var(--on-accent); }
.player.playing .pp:hover { box-shadow: var(--shadow-accent); }
.spin { width: 18px; height: 18px; border-radius: 50%; border: 3px solid currentColor; border-right-color: transparent; animation: turn 0.8s linear infinite; }
@keyframes turn { to { transform: rotate(360deg); } }

.track { flex: 1; min-width: 0; display: grid; gap: 4px; }
.time { font-size: 12.5px; font-weight: 600; color: var(--ink-2); font-variant-numeric: tabular-nums; }

input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 22px; margin: 0; background: transparent; cursor: pointer; }
input[type='range']:disabled { cursor: default; }
input[type='range']::-webkit-slider-runnable-track {
  height: 8px; border-radius: 999px; background: linear-gradient(90deg, var(--blue-900), var(--teal-600)) 0 / var(--p, 0%) 100% no-repeat, var(--line);
}
input[type='range']::-moz-range-track { height: 8px; border-radius: 999px; background: var(--line); }
input[type='range']::-moz-range-progress { height: 8px; border-radius: 999px; background: linear-gradient(90deg, var(--blue-900), var(--teal-600)); }
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none; width: 18px; height: 18px; margin-top: -5px; border-radius: 50%;
  background: var(--surface); border: 3px solid var(--blue-900); box-shadow: var(--shadow);
}
input[type='range']::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: var(--surface); border: 3px solid var(--blue-900); box-shadow: var(--shadow); }
input[type='range']:disabled::-webkit-slider-thumb { border-color: var(--dot); }
input[type='range']:disabled::-moz-range-thumb { border-color: var(--dot); }

.fb { font-size: 12.5px; color: var(--ink-in); background: var(--tint-blue); padding: 6px 12px; border-radius: 10px; }
.warn {
  display: flex; align-items: flex-start; gap: 8px; padding: 8px 12px; border-radius: 10px;
  background: var(--tint-pr); color: var(--ink-pr); font-size: 13px; font-weight: 600;
}
.warn svg { flex: none; margin-top: 2px; }

.tr summary { cursor: pointer; font-size: 13.5px; font-weight: 700; color: var(--blue-900); padding: 4px 2px; border-radius: 6px; width: fit-content; }
.tr summary:hover { text-decoration: underline; }
.tr div { display: grid; gap: 8px; margin-top: 8px; padding: 12px 14px; border-radius: 12px; background: var(--tint-blue); }
.tr p { font-size: 13.5px; line-height: 1.55; color: var(--ink); }

@media (max-width: 720px) {
  .body { padding: 14px; }
  ul { grid-template-columns: minmax(0, 1fr); }
}
</style>
