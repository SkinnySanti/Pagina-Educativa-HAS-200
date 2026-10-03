<script setup>
import LogoMark from '../common/LogoMark.vue'
import WelcomePortrait from '../common/WelcomePortrait.vue'
import { useI18n } from '../../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <section class="intro" aria-labelledby="welcome-title">
    <div class="welcome">
      <WelcomePortrait class="portrait-slot" />
      <div>
        <span class="badge"><LogoMark class="badge-mark" />{{ t.welcome.badge }}</span>
        <h2 id="welcome-title">{{ t.welcome.title }}</h2>
        <p>{{ t.welcome.text }}</p>
      </div>
    </div>

    <!-- Qué módulos existen y para qué sirven ya lo cuenta, con botones reales,
         la Ruta de aprendizaje de abajo: esta tarjeta no lo repite.
         Solo responde "¿para qué me sirve todo esto?". -->
    <article class="card box">
      <div class="copy">
        <h3>{{ t.overview.title }}</h3>
        <p>{{ t.overview.text }}</p>
      </div>

      <div class="goals-col">
        <h4>{{ t.overview.goalsTitle }}</h4>
        <ul class="goals">
          <li v-for="g in t.overview.goals" :key="g">{{ g }}</li>
        </ul>
      </div>
    </article>
  </section>
</template>

<style scoped>
.intro { display: grid; gap: 20px; }

.welcome {
  display: flex; gap: 18px; align-items: flex-start;
  padding: 24px 28px; border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--tint-blue), var(--tint-green));
  border: 1px solid var(--welcome-line); border-left: 6px solid var(--teal-600);
}
.portrait-slot { flex: none; }
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  color: var(--teal-600); background: var(--glass);
  padding: 3px 10px 3px 6px; border-radius: 999px; margin-bottom: 8px;
}
.badge-mark { width: 16px; height: 16px; }
.welcome h2 { font-size: 24px; font-weight: 700; line-height: 1.25; }
.welcome p { margin-top: 6px; max-width: 70ch; }

.box {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.9fr);
  gap: 28px 40px;
  align-items: start;
  padding: 24px 28px;
  transition: box-shadow 0.25s ease;
}
.box:hover { box-shadow: var(--shadow-lift); }
.box h3 { font-size: 20px; font-weight: 700; line-height: 1.25; }
.copy p { margin-top: 8px; color: var(--ink-2); }
.box h4 { margin: 0; font-size: 14px; font-weight: 600; line-height: 1.25; color: var(--blue-900); }

.goals { list-style: none; margin-top: 10px; display: grid; gap: 10px; }
.goals li { position: relative; padding-left: 24px; font-size: 14.5px; color: var(--ink-2); }
.goals li::before {
  content: ''; position: absolute; left: 0; top: 0.45em; width: 12px; height: 12px;
  border-radius: 50%; background: var(--teal-600); box-shadow: inset 0 0 0 3px var(--surface), 0 0 0 2px var(--teal-600);
}

@media (max-width: 960px) {
  .welcome { padding: 20px; }
  .portrait-slot { width: 72px; height: auto; }
  .box { grid-template-columns: minmax(0, 1fr); gap: 16px; padding: 20px; }
}
</style>
