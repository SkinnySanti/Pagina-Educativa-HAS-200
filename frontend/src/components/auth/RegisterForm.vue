<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthField from './AuthField.vue'
import AppIcon from '../common/AppIcon.vue'
import PolicyDialog from './PolicyDialog.vue'
import { useFormFields } from '../../composables/useFormFields'
import { useAuth } from '../../composables/useAuth'
import { serverMessage } from '../../utils/serverMessage'
import { vAlias, vEmail, vNewPassword } from '../../utils/validators'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const a = computed(() => t.value.auth)
const router = useRouter()
const { register } = useAuth()

const form = useFormFields({
  email: { validate: vEmail },
  emailConfirm: {
    validate: (v, all) => (!v ? 'req' : v.toLowerCase() !== all.email.toLowerCase() ? 'emailMatch' : ''),
  },
  alias: { validate: vAlias },
  password: { validate: vNewPassword, trim: false },
  passwordConfirm: {
    validate: (v, all) => (!v ? 'req' : v !== all.password ? 'passMatch' : ''),
    trim: false,
  },
})

// Errores que devuelve el servidor por campo (clave del formulario → clave de a.errors).
// Se borran en cuanto el estudiante edita ese campo.
const serverErrors = ref({})
const clearServerError = (k) => {
  if (serverErrors.value[k]) serverErrors.value = { ...serverErrors.value, [k]: '' }
}
watch(() => form.values.email, () => clearServerError('email'))
watch(() => form.values.alias, () => clearServerError('alias'))
watch(() => form.values.password, () => clearServerError('password'))

const err = (k) => {
  const key = form.visibleError(k) || serverErrors.value[k]
  return key ? a.value.errors[key] : ''
}

// La política solo se acepta al registrarse (en el login no se pide).
const accepted = ref(false)
const policyTouched = ref(false)
const policyError = computed(() => policyTouched.value && !accepted.value)
const policy = ref(null)

const formEl = ref(null)
const pending = ref(false)
const failure = ref(null) // ApiError sin campo asociado (red, 5xx, 409 ambiguo…)

// 409 con campo identificable y 400 con detalle por campo → bajo el campo; el resto → mensaje general.
function showServerError(e) {
  const byField = {}
  if (e.status === 409 && e.conflictField === 'email') byField.email = 'emailTaken'
  if (e.status === 409 && e.conflictField === 'alias') byField.alias = 'aliasTaken'
  if (e.status === 400 && e.fields) {
    if (e.fields.correo) byField.email = 'email'
    if (e.fields.alias) byField.alias = 'alias'
    if (e.fields.contrasena) byField.password = 'passLen'
  }
  if (Object.keys(byField).length) {
    serverErrors.value = byField
    nextTick(() => formEl.value?.querySelector('[aria-invalid="true"]')?.focus())
  } else {
    failure.value = e
  }
}

async function onSubmit() {
  failure.value = null
  serverErrors.value = {}
  const fieldsOk = form.validateAll()
  policyTouched.value = true
  if (!fieldsOk || !accepted.value) {
    await nextTick()
    formEl.value?.querySelector('[aria-invalid="true"]')?.focus()
    return
  }
  pending.value = true
  try {
    await register({
      email: form.clean('email'),
      alias: form.clean('alias'),
      password: form.values.password,
      policyAccepted: accepted.value,
    })
    // El registro NO inicia sesión (el backend no devuelve tokens): se lleva al login con un aviso.
    router.push({ path: '/login', query: { registered: '1' } })
  } catch (e) {
    showServerError(e)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form ref="formEl" class="auth-form is-register" novalidate @submit.prevent="onSubmit">
    <h2 class="form-title full">{{ a.register.title }}</h2>
    <p class="form-sub full">{{ a.register.sub }}</p>

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
      v-model="form.values.emailConfirm"
      type="email"
      icon="mail"
      autocomplete="off"
      inputmode="email"
      :label="a.fields.emailConfirm"
      :placeholder="a.placeholders.emailConfirm"
      :error="err('emailConfirm')"
      :valid="form.isValid('emailConfirm')"
      @blur="form.touch('emailConfirm')"
    />
    <AuthField
      v-model="form.values.alias"
      class="full"
      icon="user"
      autocomplete="username"
      :label="a.fields.alias"
      :placeholder="a.placeholders.alias"
      :hint="a.hints.alias"
      :error="err('alias')"
      :valid="form.isValid('alias')"
      @blur="form.touch('alias')"
    />
    <AuthField
      v-model="form.values.password"
      type="password"
      icon="lock"
      autocomplete="new-password"
      :label="a.fields.password"
      :placeholder="a.placeholders.passwordNew"
      :hint="a.hints.password"
      :error="err('password')"
      :valid="form.isValid('password')"
      @blur="form.touch('password')"
    />
    <AuthField
      v-model="form.values.passwordConfirm"
      type="password"
      icon="lock"
      autocomplete="new-password"
      :label="a.fields.passwordConfirm"
      :placeholder="a.placeholders.passwordConfirm"
      :error="err('passwordConfirm')"
      :valid="form.isValid('passwordConfirm')"
      @blur="form.touch('passwordConfirm')"
    />

    <div class="field full">
      <div class="check" :class="{ invalid: policyError }">
        <label>
          <input
            v-model="accepted"
            type="checkbox"
            :aria-invalid="policyError"
            :aria-describedby="policyError ? 'policy-err' : undefined"
            @change="policyTouched = true"
          />
          <span class="box"><AppIcon name="check" :size="14" /></span>
          <span>
            {{ a.policy.accept }}
            <button type="button" class="linklike" @click.prevent="policy.open()">{{ a.policy.link }}</button>
          </span>
        </label>
      </div>
      <p v-if="policyError" id="policy-err" class="err" role="alert">
        <AppIcon name="alert" :size="16" /><span>{{ a.errors.policy }}</span>
      </p>
    </div>

    <p v-if="failure" class="status error full" role="alert">{{ serverMessage(a, failure) }}</p>

    <button class="btn btn-primary submit full" type="submit" :disabled="pending">
      {{ pending ? a.register.pending : a.register.submit }}
    </button>

    <p class="switch full">
      {{ a.register.hasAccount }}
      <RouterLink to="/login" class="linklike">{{ a.tabs.login }}</RouterLink>
    </p>

    <PolicyDialog ref="policy" />
  </form>
</template>
