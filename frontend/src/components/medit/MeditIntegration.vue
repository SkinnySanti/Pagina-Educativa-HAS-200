<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { INTEGRACION } from '../../config/medit'
import { useI18n } from '../../i18n'

// Un eje del MEDIT → la parte de la plataforma que lo aplica.
const { t } = useI18n()
const m = computed(() => t.value.medit.integracion)
</script>

<template>
  <section class="integ" aria-labelledby="me-integ-title">
    <div class="head">
      <h2 id="me-integ-title">{{ m.title }}</h2>
      <p>{{ m.text }}</p>
    </div>
    <ul class="grid">
      <li v-for="x in INTEGRACION" :key="x.id" class="card item">
        <span class="ico"><AppIcon :name="x.icon" :size="24" /></span>
        <h3>{{ m.items[x.id].title }}</h3>
        <ul class="bullets">
          <li v-for="b in m.items[x.id].bullets" :key="b"><AppIcon name="check" :size="16" />{{ b }}</li>
        </ul>
        <RouterLink :to="x.to" class="go">
          {{ m.go }}: {{ m.items[x.id].module }}<AppIcon name="chevron-right" :size="16" />
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.integ { display: grid; gap: 16px; }
h2 { font-size: 22px; font-weight: 700; }
.head p { color: var(--ink-2); margin-top: 4px; }
.grid { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.item {
  display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 22px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.item:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
.ico {
  width: 46px; height: 46px; border-radius: 12px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.item:hover .ico { background: var(--blue-900); color: var(--on-accent); transform: scale(1.08) rotate(-6deg); }
h3 { font-size: 17px; font-weight: 700; line-height: 1.3; }
.bullets { list-style: none; display: grid; gap: 8px; }
.bullets li { display: flex; gap: 8px; font-size: 14px; line-height: 1.45; color: var(--ink-2); }
.bullets svg { flex: none; margin-top: 3px; color: var(--green-cta); }
.go {
  margin-top: auto; display: inline-flex; align-items: center; gap: 4px; padding-top: 4px;
  font-size: 14px; font-weight: 700; color: var(--blue-900); text-decoration: none; border-radius: 6px;
}
.go:hover { text-decoration: underline; text-underline-offset: 3px; }

@media (max-width: 800px) { .grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 560px) { .item { padding: 18px; } }
</style>
