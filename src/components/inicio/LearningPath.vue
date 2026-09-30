<script setup>
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const icons = ['book', 'pencil', 'flag']
</script>

<template>
  <section id="ruta-aprendizaje" class="path" aria-labelledby="path-title">
    <header class="head">
      <h2 id="path-title">{{ t.path.title }}</h2>
      <p>{{ t.path.text }}</p>
    </header>

    <!-- Paso prioritario: la inducción empieza con el diagnóstico, no con las guías. -->
    <article class="diagnostic">
      <span class="badge">{{ t.path.diagnostic.badge }}</span>
      <div class="row">
        <div class="ico"><AppIcon name="target" :size="30" /></div>
        <div class="copy">
          <h3>{{ t.path.diagnostic.title }}</h3>
          <p>{{ t.path.diagnostic.text }}</p>
        </div>
        <button type="button" class="cta" disabled :title="t.nav.soonTitle">
          {{ t.path.diagnostic.cta }} <em>{{ t.nav.soon }}</em>
        </button>
      </div>
    </article>

    <div class="arrow-down" aria-hidden="true"><AppIcon name="chevron-right" :size="20" /></div>

    <!-- Los 3 módulos siguientes, como tarjetas de un índice: ícono, título, 2 bullets y botón. -->
    <ol class="modules">
      <li v-for="(m, i) in t.path.modules" :key="m.title" class="card mod">
        <div class="ico"><AppIcon :name="icons[i]" :size="24" /></div>
        <h3>{{ m.title }}</h3>
        <ul class="bullets">
          <li v-for="b in m.bullets" :key="b">{{ b }}</li>
        </ul>
        <button type="button" class="cta secondary" disabled :title="t.nav.soonTitle">
          {{ m.cta }} <em>{{ t.nav.soon }}</em>
        </button>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.path { scroll-margin-top: calc(var(--header-h) + 12px); }
.head { margin-bottom: 16px; }
.head h2 { font-size: 24px; font-weight: 700; }
.head p { margin-top: 6px; color: var(--ink-2); max-width: 70ch; }

/* --- CTA prioritario: evaluación diagnóstica --- */
.diagnostic {
  position: relative;
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  background: var(--grad);
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.diagnostic:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 32px rgba(15, 45, 90, 0.25);
}
.diagnostic:hover .ico { transform: scale(1.08) rotate(-6deg); }
.badge {
  display: inline-block; font-size: 12px; font-weight: 700;
  background: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 999px;
  margin-bottom: 14px;
}
.row { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.diagnostic .ico {
  flex: none; width: 54px; height: 54px; border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  display: grid; place-items: center;
  transition: transform 0.25s ease;
}
.diagnostic .copy { flex: 1 1 260px; }
.diagnostic h3 { font-size: 20px; font-weight: 700; }
.diagnostic p { margin-top: 4px; color: #eaf4ff; font-size: 14.5px; max-width: 60ch; }

.cta {
  flex: none; display: inline-flex; align-items: center; gap: 8px;
  border: 0; font-size: 14px; font-weight: 700;
  background: #fff; color: var(--blue-900);
  padding: 11px 18px; border-radius: 999px;
}
/* disabled real (no <span>): el navegador ya la salta del tab order.
   Se anula el opacity/gris que algunos navegadores aplican por defecto,
   para no perder contraste. */
.cta:disabled { cursor: not-allowed; opacity: 1; }
.cta em {
  font-style: normal; font-size: 11px; font-weight: 700;
  background: var(--tint-blue); color: var(--blue-900); padding: 2px 8px; border-radius: 999px;
}
.cta.secondary { background: var(--tint-blue); color: var(--blue-900); font-size: 13.5px; padding: 9px 16px; }
.cta.secondary em { background: #fff; }

.arrow-down {
  width: fit-content; margin: 6px auto;
  color: var(--blue-900); opacity: 0.5;
  transform: rotate(90deg);
  pointer-events: none;
}

/* --- Tarjetas de módulo --- */
.modules { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.mod {
  padding: 22px; display: flex; flex-direction: column;
  border: 1px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.mod:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(20, 40, 80, 0.12);
  border-color: var(--tint-blue);
}
.mod:hover .ico { background: var(--blue-900); color: #fff; transform: scale(1.08); }
.mod .ico {
  width: 46px; height: 46px; border-radius: 12px;
  background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; margin-bottom: 14px;
  transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.mod h3 { font-size: 17px; font-weight: 700; }

.bullets { list-style: none; margin-top: 10px; margin-bottom: 18px; display: grid; gap: 6px; flex: 1; }
.bullets li { position: relative; padding-left: 18px; font-size: 14px; color: var(--ink-2); line-height: 1.4; }
.bullets li::before { content: '•'; position: absolute; left: 2px; color: var(--teal-600); font-weight: 700; }

.mod .cta { align-self: flex-start; }

@media (max-width: 1180px) {
  .modules { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 720px) {
  .modules { grid-template-columns: minmax(0, 1fr); }
  .row { align-items: flex-start; }
  .cta { width: 100%; justify-content: center; }
}
</style>
