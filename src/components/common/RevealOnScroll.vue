<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Anima la entrada de su contenido cuando entra en el viewport.
// Con prefers-reduced-motion la transición queda anulada globalmente
// (ver src/styles/base.css), así que el contenido igual aparece, solo
// que sin animación. Si el navegador no soporta IntersectionObserver,
// se muestra de inmediato (nunca se queda invisible).
defineProps({ delay: { type: Number, default: 0 } })

const el = ref(null)
const visible = ref(false)
let io

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    visible.value = true
    return
  }
  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true
        io.disconnect()
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  if (el.value) io.observe(el.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div ref="el" class="reveal" :class="{ visible }" :style="{ transitionDelay: `${delay}ms` }">
    <slot />
  </div>
</template>

<style scoped>
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
.reveal.visible { opacity: 1; transform: none; }
</style>
