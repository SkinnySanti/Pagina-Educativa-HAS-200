<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { RECURSOS } from '../../config/medit'
import { useI18n } from '../../i18n'

// Tarjetas con los PDF oficiales de la Universidad. Se agregan en config/medit.js (RECURSOS).
const { t } = useI18n()
const r = computed(() => t.value.medit.recursos)
</script>

<template>
  <section class="rec" aria-labelledby="me-rec-title">
    <div class="head">
      <h2 id="me-rec-title">{{ r.title }}</h2>
      <p>{{ r.text }}</p>
    </div>
    <ul class="grid">
      <li v-for="d in RECURSOS" :key="d.id">
        <a class="card doc" :href="d.url" target="_blank" rel="noopener noreferrer">
          <span class="ico"><AppIcon name="book" :size="24" /></span>
          <span class="tag">PDF · {{ r.source }}</span>
          <b>{{ r.docs[d.id].title }}</b>
          <span class="txt">{{ r.docs[d.id].text }}</span>
          <span class="open">{{ r.open }} ↗</span>
        </a>
      </li>
    </ul>
    <p class="note">{{ r.note }}</p>
  </section>
</template>

<style scoped>
.rec { display: grid; gap: 16px; }
h2 { font-size: 22px; font-weight: 700; }
.head p { color: var(--ink-2); margin-top: 4px; }
.grid { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.doc {
  height: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 22px;
  color: inherit; text-decoration: none; border: 2px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.doc:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--tint-blue); }
.ico {
  width: 46px; height: 46px; border-radius: 12px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; margin-bottom: 4px; transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.doc:hover .ico { background: var(--blue-900); color: var(--on-accent); transform: scale(1.08) rotate(-6deg); }
.tag { font-size: 12px; font-weight: 700; color: var(--teal-600); }
b { font-size: 17px; font-weight: 700; line-height: 1.3; }
.txt { font-size: 14px; line-height: 1.45; color: var(--ink-2); }
.open { margin-top: auto; padding-top: 6px; font-size: 14px; font-weight: 700; color: var(--blue-900); }
.doc:hover .open { text-decoration: underline; text-underline-offset: 3px; }
.note { font-size: 13px; color: var(--ink-2); }

@media (max-width: 640px) { .grid { grid-template-columns: minmax(0, 1fr); } .doc { padding: 18px; } }
</style>
