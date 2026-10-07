<script setup>
import { computed, nextTick, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthField from './AuthField.vue'
import { useFormFields } from '../../composables/useFormFields'
import { useAuth } from '../../composables/useAuth'
import { serverMessage } from '../../utils/serverMessage'
import { vEmail, vRequired } from '../../utils/validators'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const a = computed(() => t.value.auth)
const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const form = useFormFields({
  email: { validate: vEmail },
  password: { validate: vRequired, trim: false },
})
const err = (k) => (form.visibleError(k) ? a.value.errors[form.visibleError(k)] : '')

const formEl = ref(null)
const pending = ref(false)
const failure = ref(null) // ApiError del servidor
const justRegistered = computed(() => route.query.registered === '1')

async function onSubmit() {
  failure.value = null
  if (!form.validateAll()) {
    await nextTick()
    formEl.value?.querySelector('[aria-invalid="true"]')?.focus()
    return
  }
  pending.value = true
  try {
    await login({ email: form.clean('email'), password: form.values.password })
    // Vuelve a donde iba (ruta protegida) o al inicio. Solo rutas internas ("/algo", nunca "//sitio.com").
    const to = String(route.query.redirect || '')
    router.push(to.startsWith('/') && !to.startsWith('//') ? to : '/')
  } catch (e) {
    failure.value = e
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form ref="formEl" class="auth-form" novalidate @submit.prevent="onSubmit">
    <h2 class="form-title">{{ a.login.title }}</h2>
    <p class="form-sub">{{ a.login.sub }}</p>

    <p v-if="justRegistered" class="status" role="status">{{ a.login.registered }}</p>

    <AuthField
      v-model="form.values.email"
      type="email"
      icon="mail"
      autocomplete="email"
      inputmode="email"
      :label="a.fields.email"
      :placeholder="a.placeholders.email"
      :error="err('email')"
      :valid="form.isValid('email')"
      @blur="form.touch('email')"
    />
    <AuthField
      v-model="form.values.password"
      type="password"
      icon="lock"
      autocomplete="current-password"
      :label="a.fields.password"
      :placeholder="a.placeholders.passwordLogin"
      :error="err('password')"
      :valid="form.isValid('password')"
      @blur="form.touch('password')"
    />

    <p v-if="failure" class="status error" role="alert">{{ serverMessage(a, failure) }}</p>

    <button class="btn btn-primary submit" type="submit" :disabled="pending">
      {{ pending ? a.login.pending : a.login.submit }}
    </button>

    <p class="switch">
      {{ a.login.noAccount }}
      <RouterLink to="/registro" class="linklike">{{ a.tabs.register }}</RouterLink>
    </p>
  </form>
</template>
