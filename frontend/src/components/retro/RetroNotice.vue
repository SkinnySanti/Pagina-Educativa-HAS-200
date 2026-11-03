<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Aviso de acceso: 'login' (sin sesión) o 'empty' (con sesión pero sin intentos enviados).
// Es el ÚNICO botón de la vista sin sesión que lleva al login; el login devuelve a /retroalimentacion con ?redirect=.
const props = defineProps({ kind: { type: String, default: 'login' } }) // 'login' | 'empty'
const { t } = useI18n()
const n = computed(() => t.value.retro.notice[props.kind])
const to = computed(() => (props.kind === 'login' ? { name: 'login', query: { redirect: '/retroalimentacion' } } : { path: '/examenes' }))
</script>

<template>
  <section class="card re-notice" aria-labelledby="re-notice-t">
    <span class="re-ico"><AppIcon :name="kind === 'login' ? 'lock' : 'clipboard'" :size="24" /></span>
    <div class="txt">
      <b id="re-notice-t">{{ n.title }}</b>
      <span>{{ n.text }}</span>
    </div>
    <RouterLink :to="to" class="btn btn-primary">
      <AppIcon :name="kind === 'login' ? 'log-in' : 'clipboard'" :size="18" />{{ n.cta }}
    </RouterLink>
  </section>
</template>
