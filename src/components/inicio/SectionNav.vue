<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { scrollToId } from '../../utils/scroll'
import { useI18n } from '../../i18n'

const { t } = useI18n()

// Los ids deben coincidir con los id de cada <section> de la página.
const links = computed(() => [
  { id: 'sec-a', label: t.value.sections.a.short },
  { id: 'sec-b', label: t.value.sections.b.short },
  { id: 'sec-c', label: t.value.sections.c.short },
  { id: 'integracion', label: t.value.subnav.integration },
  { id: 'glosario', label: t.value.subnav.glossary },
])

const current = ref('')
let observer

onMounted(() => {
  // Marca como activo el enlace de la sección que está a la vista.
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) current.value = entry.target.id
      })
    },
    { rootMargin: '-30% 0px -60% 0px' },
  )
  links.value.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav class="subnav" :aria-label="t.subnav.label">
    <a
      v-for="l in links"
      :key="l.id"
      :href="`#${l.id}`"
      :aria-current="current === l.id ? 'true' : undefined"
      @click.prevent="scrollToId(l.id)"
    >
      {{ l.label }}
    </a>
  </nav>
</template>

<style scoped>
.subnav {
  position: sticky; top: var(--header-h); z-index: 20;
  min-height: var(--subnav-h);
  background: var(--bg);
  margin-top: 8px;
  display: flex; align-items: center; gap: 8px;
  overflow-x: auto;
}
a {
  white-space: nowrap; text-decoration: none;
  font-size: 14px; font-weight: 500; color: var(--ink-2);
  background: var(--surface); border: 1px solid var(--line);
  padding: 8px 16px; border-radius: 999px;
}
a:hover { border-color: var(--blue-900); color: var(--blue-900); }
a[aria-current='true'] { background: var(--blue-900); border-color: var(--blue-900); color: var(--on-accent); }
</style>
