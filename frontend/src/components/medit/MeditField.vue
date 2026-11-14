<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import LogoMark from '../common/LogoMark.vue'
import { CAMPO } from '../../config/medit'
import { useI18n } from '../../i18n'

// Las 9 fases de la Metodología Campo de Aprendizaje (UdeC) y el módulo de la plataforma que aplica cada una.
// Mismo estilo que el recuadro «¿Para qué sirve el tutor?» (TutorIntroUses.vue).
const { t } = useI18n()
const c = computed(() => t.value.medit.campo)
</script>

<template>
  <section class="card campo" aria-labelledby="me-campo-title">
    <span class="badge"><LogoMark class="badge-mark" />{{ c.badge }}</span>
    <h2 id="me-campo-title">{{ c.title }}</h2>
    <p class="lead">{{ c.text }}</p>
    <ol class="grid">
      <li v-for="(s, i) in CAMPO" :key="s.id">
        <RouterLink :to="s.to" class="step">
          <span class="ico"><AppIcon :name="s.icon" :size="20" /></span>
          <div>
            <span class="num">{{ c.phase }} {{ i + 1 }}</span>
            <b>{{ c.steps[s.id].title }}</b>
            <span class="mod">{{ c.steps[s.id].module }}</span>
            <span class="txt">{{ c.steps[s.id].text }}</span>
          </div>
        </RouterLink>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.campo {
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
.lead { margin-top: 6px; color: var(--ink-2); max-width: 78ch; }
.grid { list-style: none; margin-top: 18px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.grid li {
  background: var(--surface); border-radius: 14px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.grid li:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
.step {
  height: 100%; display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px;
  border-radius: 14px; color: inherit; text-decoration: none;
}
.ico {
  flex: none; width: 38px; height: 38px; border-radius: 10px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center;
}
.num { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; color: var(--teal-600); }
.grid b { display: block; margin-top: 1px; font-size: 15px; font-weight: 700; line-height: 1.3; }
.mod {
  display: inline-block; margin-top: 6px; font-size: 12px; font-weight: 700; color: var(--teal-600);
  background: var(--tint-green); padding: 2px 10px; border-radius: 999px;
}
.txt { display: block; margin-top: 6px; font-size: 14px; color: var(--ink-2); line-height: 1.4; }

@media (max-width: 1040px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 720px) {
  .campo { padding: 20px; }
  .grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
