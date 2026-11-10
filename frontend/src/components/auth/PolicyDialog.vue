<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from '../../i18n'
import { POLICY_DELAY_SECONDS, safePolicyUrl } from '../../config/politica'

// Aviso de redirección a la política de datos de la Universidad (<dialog> nativo: el foco queda dentro y Esc lo cierra).
// Al abrirlo corre una cuenta regresiva; al llegar a 0 se abre el enlace (config/politica.js) en una pestaña nueva.
const { t } = useI18n()
const p = computed(() => t.value.auth.policy)
const dlg = ref(null)

const url = safePolicyUrl()
const seconds = ref(POLICY_DELAY_SECONDS)
// 'counting' → cuenta activa · 'opened' → ya se abrió · 'blocked' → el navegador bloqueó la pestaña · 'pending' → no hay enlace configurado
const status = ref('counting')
let timer = null

function stop() {
  clearInterval(timer)
  timer = null
}

function openPolicy() {
  stop()
  if (!url) {
    status.value = 'pending'
    return
  }
  // Sin 'noopener' en las features: con él window.open devuelve siempre null y no se podría detectar un bloqueo.
  // El aislamiento se logra igual quitando la referencia opener de la pestaña nueva.
  const win = window.open(url, '_blank')
  if (win) {
    try { win.opener = null } catch { /* sin acceso: no pasa nada */ }
    status.value = 'opened'
  } else {
    status.value = 'blocked' // el navegador bloqueó la pestaña: se ofrece el enlace manual
  }
}

function start() {
  stop()
  seconds.value = POLICY_DELAY_SECONDS
  status.value = 'counting'
  timer = setInterval(() => {
    seconds.value -= 1
    if (seconds.value <= 0) openPolicy()
  }, 1000)
}

function open() {
  dlg.value?.showModal()
  start()
}

function close() {
  stop()
  dlg.value?.close()
}

defineExpose({ open })
onBeforeUnmount(stop)
// Clic en el fondo oscuro (fuera de la tarjeta) también la cierra.
const onClick = (e) => e.target === dlg.value && close()
</script>

<template>
  <dialog ref="dlg" aria-labelledby="policy-title" @click="onClick" @close="stop">
    <h3 id="policy-title">{{ p.title }}</h3>
    <p>{{ p.text }}</p>

    <p class="state" role="status">
      <template v-if="status === 'counting'">{{ p.counting(seconds) }}</template>
      <template v-else-if="status === 'opened'">{{ p.opened }}</template>
      <template v-else-if="status === 'blocked'">{{ p.blocked }}</template>
      <template v-else>{{ p.pending }}</template>
    </p>
    <div v-if="status === 'counting'" class="bar" aria-hidden="true">
      <span :style="{ '--secs': `${POLICY_DELAY_SECONDS}s` }"></span>
    </div>

    <div class="acts">
      <button v-if="status === 'counting'" class="btn btn-primary" type="button" @click="openPolicy">{{ p.now }}</button>
      <a v-else-if="url" class="btn btn-primary" :href="url" target="_blank" rel="noopener noreferrer">{{ p.manual }}</a>
      <button class="btn cancel" type="button" @click="close">{{ status === 'counting' ? p.cancel : p.close }}</button>
    </div>
  </dialog>
</template>

<style scoped>
dialog {
  border: 0; border-radius: var(--radius-lg); padding: 26px 28px;
  max-width: 480px; width: calc(100% - 32px);
  background: var(--surface); color: var(--ink); box-shadow: var(--shadow-overlay);
}
dialog::backdrop { background: var(--overlay); }
h3 { font-size: 20px; margin-bottom: 8px; }
p { color: var(--ink-2); font-size: 14.5px; margin-bottom: 14px; }
.state { color: var(--ink); font-weight: 600; margin-bottom: 10px; }

/* Barra que se vacía durante la cuenta regresiva */
.bar { height: 6px; border-radius: 999px; background: var(--tint-blue); overflow: hidden; margin-bottom: 16px; }
.bar span { display: block; height: 100%; background: var(--green-cta); transform-origin: left; animation: drain var(--secs, 4s) linear forwards; }
@keyframes drain { from { transform: scaleX(1); } to { transform: scaleX(0); } }
@media (prefers-reduced-motion: reduce) { .bar span { animation: none; } }

.acts { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }
.cancel { background: var(--surface); color: var(--ink-2); border-color: var(--line); }
.cancel:hover { color: var(--blue-900); border-color: var(--blue-900); }
a.btn { text-decoration: none; }
</style>
