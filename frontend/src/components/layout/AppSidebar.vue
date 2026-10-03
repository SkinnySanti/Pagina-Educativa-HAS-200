<script setup>
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import LogoMark from '../common/LogoMark.vue'
import { useI18n } from '../../i18n'

defineProps({
  collapsed: Boolean, // versión angosta (solo íconos), en escritorio
  open: Boolean,      // cajón abierto, en móvil
  inert: Boolean,     // cajón cerrado en móvil: que el teclado no llegue a él
})
const emit = defineEmits(['navigate'])
const { t } = useI18n()

// to: null = módulo aún no construido (se muestra deshabilitado).
const items = [
  { key: 'inicio', icon: 'home', to: '/' },
  { key: 'guias', icon: 'book', to: '/guias' },
  { key: 'examenes', icon: 'clipboard', to: null },
  { key: 'feedback', icon: 'chat', to: null },
]
</script>

<template>
  <aside
    id="sidebar"
    class="sidebar"
    :class="{ collapsed, open }"
    :inert="inert ? '' : undefined"
    :aria-label="t.nav.label"
  >
    <div class="brand">
      <LogoMark />
      <div class="brand-text"><b>HAS 200</b><span>Learning</span></div>
    </div>

    <ul class="nav">
      <li v-for="item in items" :key="item.key">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="nav-link"
          :aria-label="t.nav[item.key]"
          :title="collapsed ? t.nav[item.key] : undefined"
          @click="emit('navigate')"
        >
          <AppIcon :name="item.icon" />
          <span class="label">{{ t.nav[item.key] }}</span>
        </RouterLink>

        <button
          v-else
          type="button"
          class="nav-link is-disabled"
          disabled
          :title="t.nav.soonTitle"
        >
          <AppIcon :name="item.icon" />
          <span class="text">
            <span class="label">{{ t.nav[item.key] }}</span>
            <span class="soon">{{ t.nav.soon }}</span>
          </span>
        </button>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed; inset: 0 auto 0 0; z-index: 40;
  width: var(--sidebar-w);
  background: var(--surface);
  border-right: 1px solid var(--line);
  display: flex; flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease, transform 0.2s ease;
}
.sidebar.collapsed { width: var(--sidebar-w-collapsed); }

.brand { display: flex; align-items: center; gap: 10px; padding: 0 21px; height: var(--header-h); flex: none; }
.brand-text { line-height: 1.1; white-space: nowrap; }
.brand-text b { display: block; font-size: 20px; font-weight: 700; color: var(--blue-900); }
.brand-text span { display: block; font-size: 15px; font-weight: 600; color: var(--teal-600); }

.nav { list-style: none; margin: 12px 0; }
.nav-link {
  display: flex; align-items: center; gap: 12px;
  width: 100%; padding: 13px 22px;
  background: none; border: 0; text-align: left;
  color: var(--ink-2); font-weight: 500; font-size: 15px;
  text-decoration: none; white-space: nowrap;
}
.nav-link:hover:not(.is-disabled) { background: var(--hover); }
.nav-link[aria-current='page'] {
  background: var(--tint-blue); color: var(--blue-900);
  box-shadow: inset 3px 0 0 var(--blue-900);
}
.nav-link svg { flex: none; }

/* Antes: opacity 0.6 en todo el ítem, lo que bajaba el contraste del texto
   de 5.97:1 a 2.57:1 (falla WCAG AA). Ahora el color se queda igual de
   legible; lo "deshabilitado" se comunica con la etiqueta "Pronto" y el cursor. */
.is-disabled { cursor: not-allowed; }
.text { display: flex; flex-direction: column; line-height: 1.25; }
.soon { font-size: 12px; font-weight: 600; color: var(--blue-900); }

/* --- versión angosta (escritorio) --- */
.collapsed .brand-text,
.collapsed .label,
.collapsed .text { display: none; }
.collapsed .nav-link { justify-content: center; padding-inline: 0; }

/* --- móvil: cajón que entra desde la izquierda --- */
@media (max-width: 960px) {
  .sidebar { width: var(--sidebar-w); transform: translateX(-100%); }
  .sidebar.open { transform: none; box-shadow: var(--shadow-overlay); }
}
</style>
