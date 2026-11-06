<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import TutorSide from './TutorSide.vue'
import { useI18n } from '../../i18n'

// Panel lateral sin sesión: por qué hace falta iniciar sesión + los mismos consejos y avisos del panel del tutor.
// No lleva botones (el único acceso está en TutorIntroNotice).
const { t } = useI18n()
const w = computed(() => t.value.tutor.intro.why)
</script>

<template>
  <section class="card why" aria-labelledby="tutor-why-title">
    <h3 id="tutor-why-title">{{ w.title }}</h3>
    <ul>
      <li v-for="item in w.items" :key="item">
        <AppIcon name="check" :size="16" /><span>{{ item }}</span>
      </li>
    </ul>
  </section>
  <TutorSide />
</template>

<style scoped>
.why { padding: 20px; }
h3 { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
ul { list-style: none; }
li { display: flex; gap: 8px; font-size: 14px; margin-top: 8px; }
li svg { flex: none; margin-top: 3px; color: var(--green-cta); }
</style>
