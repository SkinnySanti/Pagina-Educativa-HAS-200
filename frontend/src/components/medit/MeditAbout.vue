<script setup>
import { computed } from 'vue'
import { EJES } from '../../config/medit'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const a = computed(() => t.value.medit.about)
const ejes = computed(() => t.value.medit.ejes)
</script>

<template>
  <section class="card about" aria-labelledby="me-about-title">
    <h2 id="me-about-title">{{ a.title }}</h2>
    <p class="lead">{{ a.text }}</p>
    <h3>{{ a.ejesTitle }}</h3>
    <ul class="ejes">
      <li v-for="(k, i) in EJES" :key="k">
        <em>{{ i + 1 }}</em>
        <div>
          <b>{{ ejes[k].title }}</b>
          <span>{{ ejes[k].text }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.about { padding: 24px 28px; display: grid; gap: 10px; }
h2 { font-size: 22px; font-weight: 700; }
.lead { color: var(--ink-2); max-width: 78ch; }
h3 { font-size: 15px; font-weight: 700; margin-top: 8px; color: var(--ink); }
.ejes { list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 4px; }
.ejes li {
  display: flex; gap: 12px; align-items: flex-start; padding: 16px; border-radius: var(--radius);
  background: var(--tint-blue); transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.ejes li:hover { transform: translateY(-3px); box-shadow: var(--shadow-lift); }
em {
  flex: none; width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--green-cta); color: var(--green-cta);
  display: grid; place-items: center; font-size: 12px; font-weight: 700; font-style: normal; background: var(--surface);
}
.ejes b { display: block; font-size: 16px; margin-bottom: 2px; }
.ejes span { font-size: 14px; line-height: 1.4; color: var(--ink-2); }

@media (max-width: 1040px) { .ejes { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 560px) {
  .about { padding: 18px; }
  .ejes { grid-template-columns: minmax(0, 1fr); }
}
</style>
