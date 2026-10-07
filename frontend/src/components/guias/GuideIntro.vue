<script setup>
import { computed } from 'vue'
import RichText from '../common/RichText.vue'
import { useI18n } from '../../i18n'

const props = defineProps({ module: { type: String, default: 'm1' } })
const { t } = useI18n()
const g = computed(() => (props.module === 'm2' ? t.value.guias.m2.intro : t.value.guias.intro))
</script>

<template>
  <article class="card intro">
    <p class="hook">{{ g.hook }}</p>
    <p class="rest">{{ g.p1 }}</p>
    <p class="rest"><RichText :text="g.p2" /></p>
  </article>
</template>

<style scoped>
.intro { padding: 22px 28px; display: grid; gap: 10px; border-left: 6px solid var(--teal-600); transition: box-shadow 0.25s ease; }
.intro:hover { box-shadow: var(--shadow-lift); }
.hook { font-size: 19px; font-weight: 600; line-height: 1.4; }
.rest { color: var(--ink-2); max-width: 75ch; }
.rest :deep(b) { color: var(--ink); }
@media (max-width: 640px) { .intro { padding: 20px 16px; } }
</style>
