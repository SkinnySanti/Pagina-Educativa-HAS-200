<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import '../styles/examenes.css'
import AppIcon from '../components/common/AppIcon.vue'
import LogoMark from '../components/common/LogoMark.vue'
import ExamHero from '../components/examenes/ExamHero.vue'
import ExamNotice from '../components/examenes/ExamNotice.vue'
import ExamTypePicker from '../components/examenes/ExamTypePicker.vue'
import ExamBeforeStart from '../components/examenes/ExamBeforeStart.vue'
import ExamCard from '../components/examenes/ExamCard.vue'
import ExamTakePanel from '../components/examenes/ExamTakePanel.vue'
import ExamResult from '../components/examenes/ExamResult.vue'
import ExamSideProgress from '../components/examenes/ExamSideProgress.vue'
import ExamSideWhyLogin from '../components/examenes/ExamSideWhyLogin.vue'
import ExamStartDialog from '../components/examenes/ExamStartDialog.vue'
import ExamPortrait from '../components/common/ExamPortrait.vue'
import { useExamAccess } from '../composables/useExamAccess'
import { useExamSession } from '../composables/useExamSession'
import { useI18n } from '../i18n'
import { examMessage } from '../utils/examMessage'
import { scrollToId } from '../utils/scroll'

// Página REACTIVA a la sesión (useAuth): sin sesión se ve el aviso de acceso y los exámenes bloqueados
// sin botones; con sesión, cada examen se pinta según el `estado` que calcula el servidor (useExamAccess).
// Al comenzar, la vista baja a un recuadro debajo de las tarjetas con las preguntas (useExamSession).
const { t } = useI18n()
const e = computed(() => t.value.examenes)
const access = useExamAccess()
const { isLoggedIn } = access

const option = ref(0) // 0 diagnóstica · 1 post recorrido
const optionStatuses = computed(() => [0, 1].map((o) => access.optionStatus(o)))
const statuses = computed(() => [0, 1].map((o) => [0, 1].map((m) => access.statusOf(o, m))))

/* ───────────── Examen en pantalla ───────────── */
const session = useExamSession({ onFinished: () => access.reload() }) // al enviar, el diagnóstico pasa a USADO
const { phase, attempt, index, answers, remainingMs, summary, review, reviewState, starting } = session
const blocked = computed(() => session.active.value || starting.value !== null)

const optionOf = (tipo) => (tipo === 'DIAGNOSTICO' ? 0 : 1)
const examName = (ex) => `${e.value.card.title(ex.modulo)} (${e.value.picker.options[optionOf(ex.tipo)].title})`
const takeTitle = computed(() => (session.meta.value ? examName(session.meta.value) : ''))

// Presentar un examen: confirmación → POST …/attempts. Reanudar (intento en curso) va directo, sin confirmar.
const dialog = ref(null)
const pendingExam = ref(null)
const lastTried = ref(null)
const pendingName = computed(() => (pendingExam.value ? examName(pendingExam.value) : ''))

function onStart(mod) {
  const ex = access.examOf(option.value, mod)
  if (!ex) return
  if (ex.intentoEnCursoId) return begin(ex)
  pendingExam.value = ex
  dialog.value?.open()
}
const onConfirm = () => begin(pendingExam.value)

async function begin(ex) {
  if (!ex) return
  lastTried.value = ex
  const ok = await session.start(ex)
  if (ok) {
    await nextTick()
    scrollToId('exam-take') // baja al recuadro con las preguntas
    return
  }
  // El servidor manda: si el estado de la tarjeta quedó viejo, se vuelve a pedir la lista.
  if (['GUIA_INCOMPLETA', 'DIAGNOSTICO_USADO', 'EXAMEN_NO_ENCONTRADO'].includes(session.error.value?.codigo)) access.reload()
}

function onReview(mod) {
  const ex = access.examOf(option.value, mod)
  const id = access.lastAttemptId(option.value, mod)
  if (ex && id) session.openReview(ex, id)
}

// Al mostrarse el resultado (o una revisión abierta desde la tarjeta) la vista baja al recuadro.
watch(phase, async (p) => {
  if (p !== 'result') return
  await nextTick()
  scrollToId('exam-take')
})
// Si la sesión se cierra (logout, refresh vencido) el recuadro se retira; las marcas quedan guardadas para reanudar.
watch(isLoggedIn, (ok) => !ok && session.close())

/* ───────────── Mensajes de error (por `codigo`, con i18n) ───────────── */
const takeError = computed(() => (phase.value === 'taking' ? examMessage(e.value.errors, session.error.value) : ''))
const reviewErrorText = computed(() => examMessage(e.value.errors, session.reviewError.value))
const noticeText = computed(() => {
  if (access.loadState.value === 'error') return examMessage(e.value.errors, access.loadError.value)
  if (phase.value === 'idle' && session.error.value) return examMessage(e.value.errors, session.error.value)
  return ''
})
const showGuideLink = computed(() => phase.value === 'idle' && session.error.value?.codigo === 'GUIA_INCOMPLETA')
const guideLink = computed(() => ({ path: '/guias', query: { modulo: String(lastTried.value?.modulo ?? 1) } }))
</script>

<template>
  <div class="examenes content">
    <nav class="crumbs" :aria-label="e.crumbs.label">
      <RouterLink to="/">{{ e.crumbs.home }}</RouterLink>
      <AppIcon name="chevron-right" :size="14" />
      <b aria-current="page">{{ e.crumbs.current }}</b>
    </nav>

    <ExamHero />
    <ExamNotice v-if="!isLoggedIn" />
    <ExamTypePicker v-model="option" :statuses="optionStatuses" />

    <div class="layout">
      <div class="col">
        <Transition name="exstep" mode="out-in">
          <section :key="option" class="exam-panel" aria-labelledby="exam-panel-title">
            <div class="intro">
            <div class="welcome">
              <ExamPortrait class="portrait-slot" />
              <div>
                <span class="badge">
                  <LogoMark class="badge-mark" />{{ e.badge }}
                </span>
                <h2 id="exam-panel-title">{{ e.panels[option].title }}</h2>
                <p>{{ e.panels[option].text }}</p>
              </div>
            </div>
          </div>
            <ExamBeforeStart />
            <div class="exams">
              <ExamCard
                v-for="m in 2"
                :key="m"
                :option="option"
                :module="m - 1"
                :status="statuses[option][m - 1]"
                :guide="access.guides.value[m - 1]"
                :exam="access.examOf(option, m - 1)"
                :busy="starting !== null && starting === access.examOf(option, m - 1)?.id"
                :disabled="blocked"
                :review-id="access.lastAttemptId(option, m - 1)"
                @start="onStart(m - 1)"
                @review="onReview(m - 1)"
              />
            </div>
          </section>
        </Transition>

        <p v-if="noticeText" class="card exam-status err" role="alert">
          <AppIcon name="alert" :size="18" /><span>{{ noticeText }}</span>
          <RouterLink v-if="showGuideLink" :to="guideLink" class="btn btn-ghost">{{ e.errors.guideLink }}</RouterLink>
          <button v-if="access.loadState.value === 'error'" type="button" class="btn btn-ghost" @click="access.reload()">
            {{ e.errors.retryList }}
          </button>
        </p>

        <!-- Recuadro del examen: queda por debajo de las tarjetas con sus botones de inicio y es a donde baja la vista. -->
        <section v-if="phase !== 'idle'" id="exam-take" class="take-wrap" aria-labelledby="exam-take-title">
          <ExamTakePanel
            v-if="phase === 'taking' || phase === 'submitting'"
            :title="takeTitle"
            :attempt="attempt"
            :index="index"
            :answers="answers"
            :remaining-ms="remainingMs"
            :submitting="phase === 'submitting'"
            :error="takeError"
            @choose="session.choose"
            @clear="session.clearChoice"
            @go="session.goTo"
            @submit="session.submit"
          />
          <ExamResult
            v-else
            :title="takeTitle"
            :summary="summary"
            :review="review"
            :review-state="reviewState"
            :review-error="reviewErrorText"
            @close="session.close"
            @retry="session.retryReview"
          />
        </section>
      </div>

      <aside class="side">
        <ExamSideProgress
          v-if="isLoggedIn"
          :option="option"
          :statuses="statuses"
          :completed="access.isCompleted"
          :completed-count="access.completedCount.value"
          @select="option = $event"
        />
        <ExamSideWhyLogin v-else />
      </aside>
    </div>

    <ExamStartDialog
      ref="dialog"
      :name="pendingName"
      :minutes="pendingExam?.tiempoLimiteMinutos ?? null"
      :single="pendingExam?.tipo === 'DIAGNOSTICO'"
      @confirm="onConfirm"
    />
  </div>
</template>

<style scoped>
/* Mismas medidas de página que Inicio y Guías */
.content { padding: 28px; max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }

.crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 14px; color: var(--ink-2); margin-bottom: -12px; }
.crumbs a { color: var(--ink-2); text-decoration: none; border-radius: 6px; transition: color 0.15s ease; }
.crumbs a:hover { color: var(--blue-900); text-decoration: underline; }
.crumbs b { color: var(--blue-900); font-weight: 600; }

.welcome {
  display: flex; gap: 18px; align-items: flex-start;
  padding: 24px 28px; border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--tint-blue), var(--tint-green));
  border: 1px solid var(--welcome-line); border-left: 6px solid var(--teal-600);
}
.portrait-slot { flex: none; }
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.02em;
  color: var(--teal-600); background: var(--glass);
  padding: 3px 10px 3px 6px; border-radius: 999px; margin-bottom: 8px;
}
.badge-mark { width: 16px; height: 16px; }

.layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 24px; align-items: start; }
.col { min-width: 0; display: grid; gap: 18px;}
.exam-panel { display: grid; gap: 18px;}
.intro { padding: 0; }
.intro h2 { font-size: 24px; font-weight: 700; }
.intro p { margin-top: 6px; color: var(--ink-2); }
.exams { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.exam-status { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 14px 18px; font-size: 14.5px; font-weight: 600; color: var(--ink-teal); background: var(--tint-green); }
.exam-status.err { color: var(--danger); background: var(--danger-tint); }
.exam-status span { flex: 1 1 240px; }
.exam-status .btn { padding: 8px 14px; font-size: 14px; }

/* El recuadro del examen deja espacio bajo la barra superior fija al hacer scroll */
.take-wrap { scroll-margin-top: calc(var(--header-h) + 16px); }
.take-wrap:focus { outline: none; }

.side { position: sticky; top: calc(var(--header-h) + 16px); display: grid; gap: 16px; }

.exstep-enter-active, .exstep-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.exstep-enter-from { opacity: 0; transform: translateY(8px); }
.exstep-leave-to { opacity: 0; }

@media (max-width: 1040px) {
  .layout { grid-template-columns: minmax(0, 1fr); }
  .side { position: static; order: -1; }
}
@media (max-width: 960px) {
  .content { padding: 16px; gap: 20px; }
}
@media (max-width: 720px) {
  .exams { grid-template-columns: minmax(0, 1fr); gap: 12px; }
}
</style>
