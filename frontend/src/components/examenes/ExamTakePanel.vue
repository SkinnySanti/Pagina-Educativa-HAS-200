<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'

// Recuadro del examen en curso: una pregunta a la vez, 4 opciones con su casilla, Anterior / Siguiente
// y cronómetro. No decide nada de negocio: solo pinta y emite (el estado vive en useExamSession).
const props = defineProps({
  title: { type: String, default: '' },
  attempt: { type: Object, required: true }, // respuesta de POST …/attempts (preguntas ya ordenadas)
  index: { type: Number, required: true }, // pregunta visible (0 a 9)
  answers: { type: Object, required: true }, // { [preguntaId]: opcionId }
  remainingMs: { type: Number, required: true },
  submitting: Boolean,
  error: { type: String, default: '' }, // texto ya traducido del último error de envío
})
const emit = defineEmits(['choose', 'clear', 'go', 'submit'])
const { t } = useI18n()
const x = computed(() => t.value.examenes.take)

const questions = computed(() => props.attempt.preguntas)
const total = computed(() => questions.value.length)
const q = computed(() => questions.value[props.index])
const picked = computed(() => props.answers[q.value.id] ?? null)
const answered = computed(() => Object.keys(props.answers).length)
const missing = computed(() => total.value - answered.value)
const isLast = computed(() => props.index === total.value - 1)
const letters = ['A', 'B', 'C', 'D']

/* Cronómetro: mm:ss, con aviso visual a 5 min y a 1 min */
const clock = computed(() => {
  const s = Math.ceil(props.remainingMs / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})
const level = computed(() => (props.remainingMs <= 60_000 ? 'danger' : props.remainingMs <= 300_000 ? 'warn' : ''))
// El lector de pantalla no debe leer cada segundo: solo se anuncia cuando faltan 5 y 1 minuto.
const announce = ref('')
const minutesLeft = computed(() => Math.ceil(props.remainingMs / 60_000))
watch(minutesLeft, (m) => {
  if (m === 5 || m === 1) announce.value = x.value.minutesLeft(m)
})

/* Confirmación antes de enviar (dentro del recuadro, sin diálogo aparte) */
const confirming = ref(false)
const confirmBtn = ref(null)
async function askConfirm() {
  confirming.value = true
  await nextTick()
  confirmBtn.value?.focus()
}
watch(() => props.index, () => (confirming.value = false))
watch(() => props.submitting, (v) => !v && (confirming.value = false))

// Al cambiar de pregunta, el foco pasa al enunciado (teclado y lectores de pantalla).
const qTitle = ref(null)
watch(() => props.index, async () => {
  await nextTick()
  qTitle.value?.focus({ preventScroll: true })
})
</script>

<template>
  <article class="card take" aria-labelledby="exam-take-title">
    <header class="head">
      <div class="ttl">
        <h3 id="exam-take-title">{{ title }}</h3>
        <p class="sub">{{ x.counter(index + 1, total) }} · {{ x.answered(answered, total) }}</p>
      </div>
      <div class="clock" :class="level" role="timer" aria-live="off" :aria-label="x.clockLabel">
        <AppIcon name="clock" :size="18" /><b>{{ clock }}</b>
      </div>
    </header>
    <p class="visually-hidden" role="status" aria-live="polite">{{ announce }}</p>

    <ol class="pips" :aria-label="x.navLabel">
      <li v-for="(item, i) in questions" :key="item.id">
        <button
          type="button"
          class="pip"
          :class="{ cur: i === index, done: answers[item.id] != null }"
          :aria-current="i === index ? 'step' : undefined"
          :aria-label="x.pipLabel(i + 1, answers[item.id] != null)"
          :disabled="submitting"
          @click="emit('go', i)"
        >{{ i + 1 }}</button>
      </li>
    </ol>

    <section :key="q.id" class="qbox">
      <p class="qmeta">
        <span class="qn">{{ x.questionN(q.posicion) }}</span>
        <span v-if="q.idioma === 'en'" class="en" :title="x.englishTitle">EN</span>
      </p>
      <!-- enunciado y opciones SIEMPRE como texto, nunca v-html (CONTEXTO §9.5) -->
      <h4 :id="`q-${q.id}`" ref="qTitle" class="qtext" tabindex="-1" :lang="q.idioma">{{ q.enunciado }}</h4>

      <div class="opts" role="radiogroup" :aria-labelledby="`q-${q.id}`">
        <label v-for="o in q.opciones" :key="o.id" class="opt" :class="{ on: picked === o.id }">
          <input
            type="radio"
            :name="`q-${q.id}`"
            :value="o.id"
            :checked="picked === o.id"
            :disabled="submitting"
            @change="emit('choose', q.id, o.id)"
          />
          <span class="box" aria-hidden="true">
            <AppIcon v-if="picked === o.id" name="check" :size="16" /><template v-else>{{ letters[o.posicion - 1] }}</template>
          </span>
          <span class="otxt" :lang="q.idioma">{{ o.texto }}</span>
        </label>
      </div>
    </section>

    <p v-if="error" class="alert" role="alert"><AppIcon name="alert" :size="18" /><span>{{ error }}</span></p>

    <footer class="foot">
      <template v-if="!confirming">
        <button type="button" class="btn btn-ghost" :disabled="index === 0 || submitting" @click="emit('go', index - 1)">
          <AppIcon name="chevron-left" :size="18" />{{ x.prev }}
        </button>
        <button v-if="picked !== null" type="button" class="link" :disabled="submitting" @click="emit('clear', q.id)">
          {{ x.clear }}
        </button>
        <button v-if="!isLast" type="button" class="btn btn-primary push" :disabled="submitting" @click="emit('go', index + 1)">
          {{ x.next }}<AppIcon name="chevron-right" :size="18" />
        </button>
        <button v-else type="button" class="btn btn-primary push" :disabled="submitting" @click="askConfirm">
          <AppIcon name="check" :size="18" />{{ x.finish }}
        </button>
      </template>

      <div v-else class="confirm">
        <p>{{ missing ? x.confirmMissing(missing) : x.confirmAll(total) }}</p>
        <div class="acts">
          <button type="button" class="btn btn-ghost" :disabled="submitting" @click="confirming = false">{{ x.confirmNo }}</button>
          <button ref="confirmBtn" type="button" class="btn btn-primary" :disabled="submitting" :aria-busy="submitting" @click="emit('submit')">
            <AppIcon name="check" :size="18" />{{ submitting ? x.sending : x.confirmYes }}
          </button>
        </div>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.take { padding: 24px 28px; display: grid; gap: 18px; border-left: 6px solid var(--teal-600); }
.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.ttl { min-width: 0; }
.ttl h3 { font-size: 19px; font-weight: 700; }
.sub { margin-top: 2px; font-size: 13.5px; color: var(--ink-2); }

.clock {
  display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px;
  background: var(--tint-blue); color: var(--blue-900); font-size: 16px; font-variant-numeric: tabular-nums;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.clock.warn { background: var(--tint-pr); color: var(--ink-pr); }
.clock.danger { background: var(--danger-tint); color: var(--danger); }

.pips { list-style: none; display: flex; flex-wrap: wrap; gap: 8px; }
.pip {
  width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--line); background: var(--surface);
  color: var(--ink-2); font-size: 13px; font-weight: 700; cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}
.pip:hover:not(:disabled) { transform: translateY(-2px); border-color: var(--blue-900); color: var(--blue-900); }
.pip.done { background: var(--blue-900); border-color: var(--blue-900); color: var(--on-accent); }
.pip.cur { border-color: var(--blue-900); box-shadow: 0 0 0 3px var(--tint-blue); }
.pip:disabled { cursor: default; }

.qbox { display: grid; gap: 10px; animation: qin 0.2s ease; }
@keyframes qin { from { opacity: 0; transform: translateY(6px); } }
.qmeta { display: flex; align-items: center; gap: 8px; }
.qn { font-size: 13px; font-weight: 700; color: var(--teal-600); }
.en { font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 999px; background: var(--tint-pr); color: var(--ink-pr); }
.qtext { font-size: 19px; font-weight: 600; line-height: 1.4; color: var(--ink); }
.qtext:focus { outline: none; }

.opts { display: grid; gap: 10px; margin-top: 4px; }
.opt {
  position: relative; display: flex; align-items: center; gap: 14px; padding: 13px 16px; cursor: pointer;
  border: 2px solid var(--line); border-radius: 14px; background: var(--surface);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}
.opt:hover { transform: translateY(-2px); box-shadow: var(--shadow-card); border-color: var(--blue-900); }
.opt.on { border-color: var(--blue-900); background: var(--tint-blue); }
.opt input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.opt input:focus-visible + .box { outline: 3px solid var(--focus); outline-offset: 2px; }
.opt input:disabled ~ * { cursor: default; }
.box {
  flex: none; width: 34px; height: 34px; border-radius: 10px; border: 2px solid var(--line); background: var(--surface-2);
  display: grid; place-items: center; font-size: 14px; font-weight: 700; color: var(--ink-2);
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.opt.on .box { background: var(--blue-900); border-color: var(--blue-900); color: var(--on-accent); }
.otxt { font-size: 15.5px; line-height: 1.4; }

.alert {
  display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px;
  background: var(--danger-tint); color: var(--danger); font-size: 14px; font-weight: 600;
}
.alert svg { flex: none; margin-top: 2px; }

.foot { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid var(--line); margin-top: 2px; }
.push { margin-left: auto; }
.link { background: none; border: 0; padding: 6px 4px; font-size: 14px; font-weight: 600; color: var(--ink-2); text-decoration: underline; cursor: pointer; border-radius: 6px; }
.link:hover:not(:disabled) { color: var(--blue-900); }

.confirm { width: 100%; display: grid; gap: 12px; }
.confirm p { font-size: 14.5px; font-weight: 600; color: var(--ink); }
.acts { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }

@media (max-width: 720px) {
  .take { padding: 18px 16px; }
  .qtext { font-size: 17px; }
  .foot .btn { flex: 1 1 auto; }
  .push { margin-left: 0; }
}
</style>
