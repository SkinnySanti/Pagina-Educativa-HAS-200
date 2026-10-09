<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Panel lateral sin sesión: solo informa. El único botón de acceso está en ExamNotice.
const { t } = useI18n()
const w = computed(() => t.value.examenes.side.why)
</script>

<template>
  <aside class="card why" aria-labelledby="exam-why-title">
    <h3 id="exam-why-title">{{ w.title }}</h3>
    <ul>
      <li v-for="item in w.items" :key="item">
        <AppIcon name="check" :size="16" /><span>{{ item }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.why { padding: 20px; }
h3 { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
ul { list-style: none; }
li { display: flex; gap: 8px; font-size: 14px; margin-top: 8px; }
li svg { flex: none; margin-top: 3px; color: var(--green-cta); }
</style>
