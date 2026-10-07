<script setup>
import { computed, ref, useId } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Campo del formulario de acceso: ícono, etiqueta, ayuda, error y (en contraseñas) botón mostrar/ocultar.
const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  icon: { type: String, required: true },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: undefined },
  hint: { type: String, default: '' },
  error: { type: String, default: '' }, // texto ya traducido; vacío = sin error
  valid: Boolean,
})
const emit = defineEmits(['update:modelValue', 'blur'])

const { t } = useI18n()
const id = useId()
const isPassword = props.type === 'password'
const visible = ref(false)
const inputType = computed(() => (isPassword && visible.value ? 'text' : props.type))
const describedBy = computed(() => [props.error && `${id}-err`, props.hint && `${id}-hint`].filter(Boolean).join(' ') || undefined)
</script>

<template>
  <div class="field" :class="{ invalid: !!error, valid }">
    <label :for="id">{{ label }}</label>
    <div class="input" :class="{ 'has-eye': isPassword }">
      <span class="lead"><AppIcon :name="icon" :size="20" /></span>
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        @input="emit('update:modelValue', $event.target.value)"
        @blur="emit('blur')"
      />
      <span class="trail">
        <span class="ok"><AppIcon name="check" :size="18" /></span>
        <button
          v-if="isPassword"
          type="button"
          :aria-pressed="visible"
          :aria-label="visible ? t.auth.hidePassword : t.auth.showPassword"
          @click="visible = !visible"
        >
          <AppIcon :name="visible ? 'eye-off' : 'eye'" :size="20" />
        </button>
      </span>
    </div>
    <p v-if="hint" :id="`${id}-hint`" class="hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-err`" class="err" role="alert">
      <AppIcon name="alert" :size="16" /><span>{{ error }}</span>
    </p>
  </div>
</template>
