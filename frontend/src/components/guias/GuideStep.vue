<script setup>
import AppIcon from '../common/AppIcon.vue'
import RichText from '../common/RichText.vue'

// Marco común de cada paso: número + título, texto, caja "explora" con el reto
// interactivo (slot "play") y la nota final.
defineProps({
  n: { type: Number, required: true },
  title: { type: String, required: true },
  kicker: { type: String, required: true },
  note: { type: String, required: true },
  noteIcon: { type: String, default: 'bulb' },
})
</script>

<template>
  <article class="card sec">
    <header class="hd">
      <span class="num" aria-hidden="true">{{ n }}</span>
      <h2 id="guia-paso" tabindex="-1">{{ title }}</h2>
    </header>

    <div class="body"><slot /></div>

    <section class="try" :aria-label="kicker">
      <p class="k"><AppIcon name="sparkles" :size="18" />{{ kicker }}</p>
      <slot name="play" />
    </section>

    <aside class="note">
      <span class="ni"><AppIcon :name="noteIcon" :size="20" /></span>
      <p><RichText :text="note" /></p>
    </aside>
  </article>
</template>

<style scoped>
.sec { padding: 26px 28px; transition: box-shadow 0.25s ease; }
.sec:hover { box-shadow: var(--shadow-lift); }
.hd { display: flex; gap: 14px; align-items: center; margin-bottom: 14px; }
.num {
  flex: none; width: 42px; height: 42px; border-radius: 12px; background: var(--tint-blue); color: var(--blue-900);
  display: grid; place-items: center; font-weight: 700; font-size: 18px;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
}
.sec:hover .num { background: var(--blue-900); color: var(--on-accent); transform: scale(1.06); }
h2 { font-size: 22px; font-weight: 700; line-height: 1.25; }
h2:focus { outline: none; }
.body { display: grid; gap: 10px; color: var(--ink-2); }
.body :deep(b) { color: var(--ink); }

.try { margin-top: 18px; border: 2px dashed var(--line); border-radius: 16px; padding: 16px 18px; }
.k {
  display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
  font-size: 14px; font-weight: 700; color: var(--teal-600);
}
.note {
  margin-top: 16px; display: flex; gap: 12px; align-items: flex-start;
  background: var(--tint-green); border-radius: 14px; padding: 14px 16px; font-size: 14.5px;
}
.ni {
  flex: none; width: 34px; height: 34px; border-radius: 10px; background: var(--surface-2); color: var(--teal-600);
  display: grid; place-items: center;
}
.note p { padding-top: 5px; }
.note :deep(b) { color: var(--ink); }

@media (max-width: 640px) {
  .sec { padding: 20px 16px; }
  .try { padding: 14px; }
  h2 { font-size: 19px; }
}
</style>
