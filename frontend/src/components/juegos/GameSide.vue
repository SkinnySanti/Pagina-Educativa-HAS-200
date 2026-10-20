<script setup>
import { computed } from 'vue'
import { useI18n } from '../../i18n'

defineProps({ steps: { type: Array, required: true } }) // pasos del juego seleccionado
const { t } = useI18n()
const s = computed(() => t.value.juegos.side)
</script>

<template>
  <section class="card how" aria-labelledby="ju-how-title">
    <h3 id="ju-how-title">{{ s.how }}</h3>
    <ol>
      <li v-for="(x, i) in steps" :key="x"><em>{{ i + 1 }}</em><span>{{ x }}</span></li>
    </ol>
  </section>
  <section class="card why">
    <h3>{{ s.tipTitle }}</h3>
    <p>{{ s.tipText }}</p>
  </section>
</template>

<style scoped>
.how { padding: 20px; transition: box-shadow 0.25s ease; }
.how:hover { box-shadow: var(--shadow-lift); }
h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
ol { list-style: none; display: grid; gap: 10px; }
li { display: flex; gap: 10px; font-size: 14px; line-height: 1.4; color: var(--ink-2); }
em {
  flex: none; width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--green-cta); color: var(--green-cta);
  display: grid; place-items: center; font-size: 11px; font-weight: 700; font-style: normal;
}
.why { padding: 20px; background: var(--tint-green); }
.why h3 { margin-bottom: 6px; }
.why p { font-size: 14px; color: var(--ink-2); }
</style>
