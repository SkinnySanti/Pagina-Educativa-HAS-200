<script setup>
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <section class="notices" aria-label="Avisos">
    <article class="card notice tutor">
      <div class="ico"><AppIcon name="robot" :size="26" /></div>
      <div>
        <h2>{{ t.aiTutor.title }}</h2>
        <p>{{ t.aiTutor.text }}</p>
        <span class="badge">{{ t.aiTutor.badge }}</span>
      </div>
    </article>

    <article class="card notice feedback">
      <div class="ico"><AppIcon name="chat" :size="26" /></div>
      <div>
        <h2>{{ t.feedback.title }}</h2>
        <p>{{ t.feedback.text }}</p>
        <span class="badge">{{ t.feedback.badge }}</span>
      </div>
    </article>
  </section>
</template>

<style scoped>
.notices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.notice {
  padding: 24px; display: flex; gap: 16px; align-items: flex-start;
  border-top: 4px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.notice:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.tutor { border-top-color: var(--teal-600); }
.feedback { border-top-color: var(--blue-900); }

.ico {
  flex: none; width: 44px; height: 44px; border-radius: 12px;
  background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center;
  transition: transform 0.25s ease;
}
.tutor .ico { background: var(--tint-green); color: var(--teal-600); }
.feedback .ico { background: var(--tint-blue); color: var(--blue-900); }
.notice:hover .ico { transform: scale(1.1) rotate(-6deg); }

h2 { font-size: 18px; font-weight: 700; }
p { margin-top: 6px; color: var(--ink-2); font-size: 14.5px; }

.badge {
  display: inline-block; margin-top: 14px; font-size: 13px; font-weight: 600;
  color: var(--teal-600); background: var(--tint-green); padding: 5px 12px; border-radius: 999px;
}

@media (max-width: 960px) {
  .notices { grid-template-columns: minmax(0, 1fr); }
}
</style>
