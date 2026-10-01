<script setup>
import { computed } from 'vue'

// Texto con **negritas** sin usar v-html: parte el texto en trozos y deja las
// negritas en <b>. Así los textos i18n pueden llevar énfasis de forma segura.
const props = defineProps({ text: { type: String, required: true } })
const parts = computed(() => props.text.split('**').map((s, i) => ({ s, bold: i % 2 === 1 })))
</script>

<template>
  <template v-for="(p, i) in parts" :key="i"><b v-if="p.bold">{{ p.s }}</b><template v-else>{{ p.s }}</template></template>
</template>
