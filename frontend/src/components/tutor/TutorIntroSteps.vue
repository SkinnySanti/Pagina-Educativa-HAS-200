<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Cómo se usa el tutor, en 3 pasos. Solo informa; el único botón de acceso está en TutorIntroNotice.
const { t } = useI18n()
const s = computed(() => t.value.tutor.intro.steps)
</script>

<template>
  <section class="card steps" aria-labelledby="tutor-steps-title">
    <h3 id="tutor-steps-title">{{ s.title }}</h3>
    <ol>
      <li v-for="(x, i) in s.items" :key="x.title">
        <em>{{ i + 1 }}</em>
        <div>
          <b><AppIcon :name="x.icon" :size="16" />{{ x.title }}</b>
          <span>{{ x.text }}</span>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.steps { padding: 22px 24px; }
h3 { font-size: 17px; font-weight: 700; margin-bottom: 14px; }
ol { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
li { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border-radius: 14px; background: var(--tint-muted); }
em {
  flex: none; width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--green-cta); color: var(--green-cta);
  display: grid; place-items: center; font-size: 12px; font-weight: 700; font-style: normal;
}
b { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 700; color: var(--blue-900); }
span { display: block; margin-top: 4px; font-size: 14px; color: var(--ink-2); line-height: 1.4; }

@media (max-width: 960px) {
  ol { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 720px) {
  .steps { padding: 18px; }
}
</style>
