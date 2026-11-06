<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Vista previa ESTÁTICA de una conversación (no es el chat real: no envía nada ni llama al servidor).
const { t } = useI18n()
const p = computed(() => t.value.tutor.intro.preview)
const c = computed(() => t.value.tutor.chat)
</script>

<template>
  <section class="card preview" aria-labelledby="tutor-preview-title">
    <header>
      <h3 id="tutor-preview-title"><AppIcon name="chat" :size="18" /> {{ p.title }}</h3>
      <span class="tag">{{ p.tag }}</span>
    </header>

    <div class="log" role="img" :aria-label="p.alt">
      <div class="msg me"><span class="who">{{ c.you }}</span><p>{{ p.question }}</p></div>
      <div class="msg bot"><span class="who">{{ c.tutor }}</span><p>{{ p.answer }}</p></div>
    </div>

    <p class="try">{{ c.suggestionsTitle }}</p>
    <ul class="chips">
      <li v-for="s in c.suggestions" :key="s">{{ s }}</li>
    </ul>
  </section>
</template>

<style scoped>
.preview { padding: 22px 24px; }
header { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
h3 { font-size: 17px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.tag { font-size: 12px; font-weight: 700; color: var(--ink-teal); background: var(--tint-green); padding: 3px 10px; border-radius: 999px; }

.log { margin-top: 14px; display: grid; gap: 12px; padding: 16px; border-radius: 14px; background: var(--bg); }
.msg { max-width: 86%; display: grid; gap: 4px; }
.who { font-size: 12px; font-weight: 700; color: var(--ink-2); }
.msg p { padding: 10px 14px; font-size: 14.5px; line-height: 1.45; border-radius: 14px; }
.me { justify-self: end; }
.me .who { justify-self: end; }
.me p { background: var(--grad); color: var(--on-grad); border-bottom-right-radius: 4px; }
.bot p { background: var(--surface); color: var(--ink); border-bottom-left-radius: 4px; box-shadow: var(--shadow); }

.try { margin-top: 16px; font-size: 13px; font-weight: 700; color: var(--ink-2); }
.chips { list-style: none; margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; }
/* Son solo ejemplos (no clicables): sin cursor de botón ni hover de acción */
.chips li { font-size: 13px; font-weight: 600; color: var(--ink-in); background: var(--tint-in); padding: 5px 12px; border-radius: 999px; }

@media (max-width: 720px) {
  .preview { padding: 18px; }
  .msg { max-width: 100%; }
}
</style>
