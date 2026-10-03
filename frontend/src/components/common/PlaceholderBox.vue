<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  icon: { type: String, default: 'image' },
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  dark: Boolean, // true cuando va sobre el degradado del hero
})
</script>

<template>
  <div class="ph" :class="{ dark }" role="img" :aria-label="`${hint}: ${label}`">
    <AppIcon :name="icon" :size="44" />
    <span>{{ label }}</span>
    <small v-if="hint">{{ hint }}</small>
  </div>
</template>

<style scoped>
.ph {
  width: 100%;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  border: 2px dashed var(--ph-line);
  background: linear-gradient(135deg, var(--tint-blue), var(--tint-green));
  color: var(--ink-2);
  font-size: 14px;
}
.ph svg { color: var(--blue-900); opacity: 0.75; }
.ph small { font-size: 12px; }

.ph.dark {
  background: var(--on-grad-softer);
  border-color: var(--on-grad-border);
  color: var(--on-grad);
}
.ph.dark svg { color: var(--on-grad); }
</style>
