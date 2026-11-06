<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const n = computed(() => t.value.tutor.intro.notice)
</script>

<template>
  <section class="card notice" aria-labelledby="tutor-notice-title">
    <span class="ico"><AppIcon name="lock" :size="24" /></span>
    <div class="txt">
      <b id="tutor-notice-title">{{ n.title }}</b>
      <span>{{ n.text }}</span>
    </div>
    <RouterLink :to="{ name: 'login', query: { redirect: '/tutor' } }" class="btn btn-primary">
      <AppIcon name="log-in" :size="18" />
      <span>{{ n.cta }}</span>
    </RouterLink>
  </section>
</template>

<style scoped>
.notice {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  padding: 18px 22px; border: 2px solid var(--tint-blue);
}
.ico {
  flex: none; width: 46px; height: 46px; border-radius: 12px; background: var(--surface-2); color: var(--blue-900);
  display: grid; place-items: center;
}
.txt { flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.txt b { font-size: 17px; font-weight: 700; }
.txt span { font-size: 14px; color: var(--ink-2); line-height: 1.4; }

/* Separación garantizada para el botón del componente */
.notice .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 720px) {
  .notice { padding: 16px; }
  .notice .btn { width: 100%; justify-content: center; }
}
</style>