<script setup>
import { useI18n } from '../../i18n'

const { t } = useI18n()
</script>

<template>
  <section id="glosario" class="block" aria-labelledby="glosario-title">
    <header class="sec-head">
      <h2 id="glosario-title">{{ t.faq.title }}</h2>
    </header>

    <div class="card faq">
      <details v-for="item in t.faq.items" :key="item.q">
        <summary>{{ item.q }}</summary>
        <p>{{ item.a }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.block { margin-top: 28px; padding-bottom: 12px; scroll-margin-top: calc(var(--header-h) + var(--subnav-h) + 8px); }
.block:focus { outline: none; }
.sec-head { margin-bottom: 16px; }
h2 { font-size: 26px; font-weight: 700; line-height: 1.2; }

.faq { padding: 8px 24px; }
details { border-bottom: 1px solid var(--line); padding: 16px 0; }
details:last-child { border-bottom: 0; }
summary { cursor: pointer; font-weight: 600; }
p { margin-top: 8px; color: var(--ink-2); max-width: 70ch; }
</style>
