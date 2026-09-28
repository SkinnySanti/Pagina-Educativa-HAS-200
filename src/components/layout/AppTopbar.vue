<script setup>
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

defineProps({ expanded: Boolean })
const emit = defineEmits(['toggle-sidebar'])
const { lang, t, setLang } = useI18n()

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
]
</script>

<template>
  <header class="topbar on-dark">
    <div class="left">
      <button
        class="menu-btn"
        type="button"
        :aria-label="t.topbar.toggleMenu"
        :aria-expanded="expanded"
        aria-controls="sidebar"
        @click="emit('toggle-sidebar')"
      >
        <AppIcon name="menu" :size="26" />
      </button>

      <div class="lang" role="group" :aria-label="t.topbar.language">
        <button
          v-for="l in languages"
          :key="l.code"
          type="button"
          :lang="l.code"
          :aria-pressed="lang === l.code"
          @click="setLang(l.code)"
        >
          {{ l.label }}
        </button>
      </div>
    </div>

    <!-- Aquí irá el alias del estudiante cuando exista el registro. -->
    <div class="right"><slot /></div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky; top: 0; z-index: 30;
  height: var(--header-h);
  background: var(--grad); color: #fff;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
}
.left { display: flex; align-items: center; gap: 14px; }

.menu-btn {
  background: none; border: 0; color: #fff; cursor: pointer;
  padding: 6px; border-radius: 10px; display: grid; place-items: center;
}
.menu-btn:hover { background: rgba(255, 255, 255, 0.14); }

.lang { display: flex; gap: 4px; background: rgba(255, 255, 255, 0.16); border-radius: 999px; padding: 3px; }
.lang button {
  border: 0; background: none; color: #fff;
  font-size: 14px; font-weight: 500;
  padding: 6px 14px; border-radius: 999px; cursor: pointer;
}
.lang button[aria-pressed='true'] { background: #fff; color: var(--blue-900); font-weight: 600; }

@media (max-width: 960px) {
  .topbar { padding: 0 16px; }
}
</style>
