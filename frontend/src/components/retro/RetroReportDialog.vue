<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import RetroCertificate from './RetroCertificate.vue'
import { useI18n } from '../../i18n'

// Vista previa del reporte (certificado) con el botón "Descargar PDF" (abre el diálogo de impresión → Guardar como PDF).
// Va en <Teleport to="body"> para que al imprimir solo salga el certificado (ver @media print en styles/retro.css).
defineProps({
  alias: String,
  stats: Object,
  skills: Array,
  compare: Object,
  errors: Array,
  basis: String,
})
const emit = defineEmits(['close'])
const { t } = useI18n()
const d = computed(() => t.value.retro.report.dialog)

const CERT_W = 1122 // A4 horizontal a 96 dpi
const CERT_H = 793
const box = ref(null)
const scale = ref(1)
const closeBtn = ref(null)
let ro = null
let opener = null

function fit() {
  if (!box.value) return
  scale.value = Math.min(1, box.value.clientWidth / CERT_W)
}
const print = () => window.print()
function onKey(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(async () => {
  opener = document.activeElement
  document.body.classList.add('re-lock')
  document.addEventListener('keydown', onKey)
  await nextTick()
  fit()
  ro = new ResizeObserver(fit)
  ro.observe(box.value)
  closeBtn.value?.focus()
})
onBeforeUnmount(() => {
  document.body.classList.remove('re-lock')
  document.removeEventListener('keydown', onKey)
  ro?.disconnect()
  opener?.focus?.()
})
</script>

<template>
  <Teleport to="body">
    <div class="re-dialog" role="dialog" aria-modal="true" aria-labelledby="re-dlg-title" @click.self="emit('close')">
      <div class="re-dlg-panel">
        <div class="re-dlg-bar">
          <div class="tt">
            <h2 id="re-dlg-title">{{ d.title }}</h2>
            <p class="re-dlg-hint">{{ d.hint }}</p>
          </div>
          <div class="acts">
            <button type="button" class="btn btn-primary" @click="print"><AppIcon name="download" :size="18" />{{ d.print }}</button>
            <button ref="closeBtn" type="button" class="btn btn-ghost" @click="emit('close')">{{ d.close }}</button>
          </div>
        </div>
        <div ref="box" class="re-dlg-stage">
          <div class="re-cert-scale" :style="{ width: `${CERT_W * scale}px`, height: `${CERT_H * scale}px` }">
            <div class="re-cert-inner" :style="{ transform: `scale(${scale})` }">
              <RetroCertificate :alias="alias" :stats="stats" :skills="skills" :compare="compare" :errors="errors" :basis="basis" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
