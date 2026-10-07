<script setup>
import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '../styles/auth.css'
import AppIcon from '../components/common/AppIcon.vue'
import LogoMark from '../components/common/LogoMark.vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import { useI18n } from '../i18n'

// Una sola vista para /login y /registro: la ruta decide qué pestaña está activa.
const { t } = useI18n()
const a = computed(() => t.value.auth)
const route = useRoute()
const router = useRouter()
const isRegister = computed(() => route.meta.mode === 'register')

const tabs = [
  { key: 'login', to: '/login', id: 'tab-login' },
  { key: 'register', to: '/registro', id: 'tab-register' },
]

// Pestañas con teclado: ← → cambian de pestaña (como en el resto del sitio).
function onKey(e, i) {
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  e.preventDefault()
  const n = (i + step + tabs.length) % tabs.length
  router.push(tabs[n].to)
  nextTick(() => document.getElementById(tabs[n].id)?.focus())
}
</script>

<template>
  <div class="auth-page">
    <div class="auth" :class="{ reg: isRegister }">
      <div class="aside on-dark">
        <span class="mark" aria-hidden="true"><LogoMark /></span>
        <h1>{{ a.aside.title }}</h1>
        <p>{{ a.aside.text }}</p>
        <ul>
          <li v-for="perk in a.aside.perks" :key="perk">
            <span class="ck"><AppIcon name="check" :size="16" /></span>
            <span>{{ perk }}</span>
          </li>
        </ul>
      </div>

      <div class="panel">
        <div class="tabs" role="tablist" :aria-label="a.tabs.label">
          <button
            v-for="(tab, i) in tabs"
            :id="tab.id"
            :key="tab.key"
            type="button"
            role="tab"
            aria-controls="auth-panel"
            :aria-selected="(tab.key === 'register') === isRegister"
            :tabindex="(tab.key === 'register') === isRegister ? 0 : -1"
            @click="router.push(tab.to)"
            @keydown="onKey($event, i)"
          >
            {{ a.tabs[tab.key] }}
          </button>
        </div>

        <div id="auth-panel" class="tabpanel" role="tabpanel" :aria-labelledby="isRegister ? 'tab-register' : 'tab-login'">
          <Transition name="authform" mode="out-in">
            <!-- KeepAlive: si cambias de pestaña y vuelves, lo que escribiste sigue ahí. -->
            <KeepAlive>
              <component :is="isRegister ? RegisterForm : LoginForm" />
            </KeepAlive>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
