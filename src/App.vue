<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'
import { useI18n } from './i18n'

const { t } = useI18n()

/* ---------- Estado del menú lateral ----------
   Escritorio: se contrae a solo íconos (y se recuerda la preferencia).
   Móvil: es un cajón que se abre y se cierra sobre el contenido. */
const COLLAPSE_KEY = 'has200-sidebar-collapsed'
function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

const isMobile = ref(false)
const collapsed = ref(readCollapsed())
const mobileOpen = ref(false)
let mql

const collapsedNow = computed(() => collapsed.value && !isMobile.value)
const menuExpanded = computed(() => (isMobile.value ? mobileOpen.value : !collapsed.value))
const sidebarInert = computed(() => isMobile.value && !mobileOpen.value)

function toggleSidebar() {
  if (isMobile.value) {
    mobileOpen.value = !mobileOpen.value
    return
  }
  collapsed.value = !collapsed.value
  try {
    localStorage.setItem(COLLAPSE_KEY, collapsed.value ? '1' : '0')
  } catch {
    /* ignorar */
  }
}

const closeMobile = () => (mobileOpen.value = false)
const onMediaChange = (e) => {
  isMobile.value = e.matches
  if (!e.matches) mobileOpen.value = false
}
const onKeydown = (e) => {
  if (e.key === 'Escape') closeMobile()
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 960px)')
  isMobile.value = mql.matches
  mql.addEventListener('change', onMediaChange)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  mql?.removeEventListener('change', onMediaChange)
  window.removeEventListener('keydown', onKeydown)
})

function focusMain() {
  document.getElementById('contenido')?.focus()
}
</script>

<template>
  <a class="skip-link" href="#contenido" @click.prevent="focusMain">{{ t.skip }}</a>

  <AppSidebar :collapsed="collapsedNow" :open="mobileOpen" :inert="sidebarInert" @navigate="closeMobile" />
  <div v-if="mobileOpen" class="scrim" aria-hidden="true" @click="closeMobile" />

  <div class="shell" :class="{ collapsed: collapsedNow }">
    <AppTopbar :expanded="menuExpanded" @toggle-sidebar="toggleSidebar" />
    <main id="contenido" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.shell { margin-left: var(--sidebar-w); transition: margin-left 0.2s ease; }
.shell.collapsed { margin-left: var(--sidebar-w-collapsed); }
main:focus { outline: none; }

.scrim { position: fixed; inset: 0; z-index: 35; background: rgba(15, 25, 50, 0.4); }

@media (max-width: 960px) {
  .shell, .shell.collapsed { margin-left: 0; }
}
</style>
