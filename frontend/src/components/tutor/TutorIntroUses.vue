<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import LogoMark from '../common/LogoMark.vue'
import { useI18n } from '../../i18n'

// ¿Para qué sirve el tutor? Solo informa (sin llamadas al backend).
const { t } = useI18n()
const u = computed(() => t.value.tutor.intro.uses)
</script>

<template>
  <section class="card uses" aria-labelledby="tutor-uses-title">
    <span class="badge"><LogoMark class="badge-mark" />{{ u.badge }}</span>
    <h2 id="tutor-uses-title">{{ u.title }}</h2>
    <p class="lead">{{ u.lead }}</p>
    <ul class="grid">
      <li v-for="it in u.items" :key="it.title">
        <span class="ico"><AppIcon :name="it.icon" :size="20" /></span>
        <div>
          <b>{{ it.title }}</b>
          <span>{{ it.text }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.uses {
  padding: 24px 28px;
  background: linear-gradient(135deg, var(--tint-blue), var(--tint-green));
  border: 1px solid var(--welcome-line); border-left: 6px solid var(--teal-600);
  box-shadow: none;
}
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  color: var(--teal-600); background: var(--glass);
  padding: 3px 10px 3px 6px; border-radius: 999px; margin-bottom: 8px;
}
.badge-mark { width: 16px; height: 16px; }
h2 { font-size: 24px; font-weight: 700; }
.lead { margin-top: 6px; color: var(--ink-2); }
.grid { list-style: none; margin-top: 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.grid li {
  display: flex; gap: 12px; align-items: flex-start;
  background: var(--surface); border-radius: 14px; padding: 14px 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.grid li:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
.ico {
  flex: none; width: 38px; height: 38px; border-radius: 10px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center;
}
.grid b { display: block; font-size: 15px; font-weight: 700; }
.grid span:not(.ico) { display: block; margin-top: 2px; font-size: 14px; color: var(--ink-2); line-height: 1.4; }

@media (max-width: 720px) {
  .uses { padding: 20px; }
  .grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
