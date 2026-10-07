<script setup>
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import LogoMark from '../common/LogoMark.vue'
import { useI18n } from '../../i18n'
import { useTheme } from '../../composables/useTheme'
import { useAuth } from '../../composables/useAuth'

// auth: pantalla de login/registro (sin menú lateral): se muestra la marca y "Volver al inicio".
defineProps({ expanded: Boolean, auth: Boolean })
const emit = defineEmits(['toggle-sidebar'])
const { lang, t, setLang } = useI18n()
const { theme, setTheme } = useTheme()
const { isLoggedIn, alias, logout } = useAuth()

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
]
</script>

<template>
  <header class="topbar on-dark">
    <div class="left">
      <button
        v-if="!auth"
        class="menu-btn"
        type="button"
        :aria-label="t.topbar.toggleMenu"
        :aria-expanded="expanded"
        aria-controls="sidebar"
        @click="emit('toggle-sidebar')"
      >
        <AppIcon name="menu" :size="26" />
      </button>
      <RouterLink v-else to="/" class="top-brand">
        <LogoMark />
        <span class="brand-text"><b>HAS 200</b><span>Learning</span></span>
      </RouterLink>

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

      <div class="theme" role="group" :aria-label="t.topbar.theme">
        <button
          type="button"
          :aria-label="t.topbar.themeLight"
          :aria-pressed="theme === 'light'"
          @click="setTheme('light')"
        >
          <AppIcon name="sun" :size="18" />
        </button>
        <button
          type="button"
          :aria-label="t.topbar.themeDark"
          :aria-pressed="theme === 'dark'"
          @click="setTheme('dark')"
        >
          <AppIcon name="moon" :size="18" />
        </button>
      </div>
    </div>

    <div class="right">
      <RouterLink v-if="auth" to="/" class="link-back">
        <AppIcon name="chevron-left" :size="18" />
        <span class="txt">{{ t.auth.session.back }}</span>
      </RouterLink>

      <template v-else-if="isLoggedIn">
        <span class="user"><AppIcon name="user" :size="18" /><span class="txt">{{ alias }}</span></span>
        <button type="button" class="btn-session" :aria-label="t.auth.session.logout" @click="logout">
          <AppIcon name="log-out" :size="18" />
          <span class="txt">{{ t.auth.session.logout }}</span>
        </button>
      </template>

      <RouterLink v-else to="/login" class="btn-session" :aria-label="t.auth.session.login">
        <AppIcon name="log-in" :size="18" />
        <span class="txt">{{ t.auth.session.login }}</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky; top: 0; z-index: 30;
  height: var(--header-h);
  background: var(--grad); color: var(--on-grad);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
}
.left, .right { display: flex; align-items: center; gap: 14px; }

/* Marca (solo en login/registro, donde no hay menú lateral) */
.top-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--on-grad); line-height: 1.1; }
.top-brand :deep(svg rect) { fill: #fff; }
.top-brand :deep(svg rect:nth-child(2)) { fill: #bff3ea; }
.brand-text b { display: block; font-size: 18px; font-weight: 700; }
.brand-text span { display: block; font-size: 13px; font-weight: 600; color: var(--on-grad-muted); }

/* Botón de sesión: misma píldora blanca del botón activo de los selectores */
.btn-session {
  display: inline-flex; align-items: center; gap: 8px; border: 0; cursor: pointer;
  background: var(--on-grad-cta); color: var(--brand);
  font-weight: 600; font-size: 14px; padding: 8px 16px; border-radius: 999px; text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-session:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2); }
.link-back {
  display: inline-flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 10px;
  color: var(--on-grad); font-size: 14px; font-weight: 600; text-decoration: none;
}
.link-back:hover { background: var(--on-grad-soft); }
.user { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; max-width: 180px; }
.user .txt { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.menu-btn {
  background: none; border: 0; color: var(--on-grad); cursor: pointer;
  padding: 6px; border-radius: 10px; display: grid; place-items: center;
}
.menu-btn:hover { background: var(--on-grad-soft); }

.lang,
.theme { display: flex; gap: 4px; background: var(--on-grad-chip); border-radius: 999px; padding: 3px; }
.lang button,
.theme button {
  border: 0; background: none; color: var(--on-grad);
  font-size: 14px; font-weight: 500;
  padding: 6px 14px; border-radius: 999px; cursor: pointer;
  display: grid; place-items: center;
}
.theme button { padding: 6px 10px; }
.lang button[aria-pressed='true'],
.theme button[aria-pressed='true'] { background: var(--on-grad-cta); color: var(--brand); font-weight: 600; }

@media (max-width: 960px) {
  .topbar { padding: 0 16px; }
  .left, .right { gap: 8px; }
}
/* En pantallas muy angostas, los botones de sesión quedan solo con ícono (tienen aria-label). */
@media (max-width: 560px) {
  .lang button { padding: 6px 9px; font-size: 13px; }
  .brand-text span, .btn-session .txt, .link-back .txt, .user .txt { display: none; }
  .btn-session { padding: 8px 10px; }
}
@media (max-width: 420px) {
  .brand-text { display: none; } /* solo queda el logo para que quepan idioma, tema y "volver" */
}
</style>
