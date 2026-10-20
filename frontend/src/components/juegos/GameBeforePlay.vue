<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const tips = computed(() => t.value.juegos.tips)
</script>

<template>
  <section class="card tips" aria-labelledby="ju-tips-title">
    <h3 id="ju-tips-title">{{ tips.title }}</h3>
    <ul>
      <li v-for="x in tips.list" :key="x"><AppIcon name="bulb" :size="16" />{{ x }}</li>
    </ul>
  </section>
</template>

<style scoped>
.tips { padding: 18px 22px; background: var(--tint-blue); }
h3 { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
ul { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 24px; }
li { display: flex; gap: 8px; font-size: 14px; line-height: 1.45; }
li svg { flex: none; margin-top: 3px; color: var(--blue-900); }

@media (max-width: 720px) {
  ul { grid-template-columns: minmax(0, 1fr); }
}
</style>
