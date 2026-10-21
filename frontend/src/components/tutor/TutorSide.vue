<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.tutor.side)
</script>

<template>
  <section class="card how" aria-labelledby="tu-how-title">
    <h3 id="tu-how-title">{{ s.howTitle }}</h3>
    <ol>
      <li v-for="(x, i) in s.how" :key="x"><em>{{ i + 1 }}</em><span>{{ x }}</span></li>
    </ol>
  </section>

  <section class="card note exam">
    <h3><AppIcon name="clipboard" :size="16" /> {{ s.examTitle }}</h3>
    <p>{{ s.examText }}</p>
  </section>

  <section class="card note privacy">
    <h3><AppIcon name="lock" :size="16" /> {{ s.privacyTitle }}</h3>
    <p>{{ s.privacyText }}</p>
  </section>
</template>

<style scoped>
.how { padding: 20px; }
h3 { font-size: 16px; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
ol { list-style: none; display: grid; gap: 10px; }
li { display: flex; gap: 10px; font-size: 14px; line-height: 1.4; color: var(--ink-2); }
em {
  flex: none; width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--green-cta); color: var(--green-cta);
  display: grid; place-items: center; font-size: 11px; font-weight: 700; font-style: normal;
}
.note { padding: 20px; }
.note h3 { margin-bottom: 6px; }
.note p { font-size: 14px; color: var(--ink-2); line-height: 1.45; }
.exam { background: var(--tint-green); }
.privacy { background: var(--tint-blue); }
</style>
