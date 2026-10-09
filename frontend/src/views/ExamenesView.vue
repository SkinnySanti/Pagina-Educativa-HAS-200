<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import '../styles/examenes.css'
import AppIcon from '../components/common/AppIcon.vue'
import ExamHero from '../components/examenes/ExamHero.vue'
import ExamNotice from '../components/examenes/ExamNotice.vue'
import ExamTypePicker from '../components/examenes/ExamTypePicker.vue'
import ExamBeforeStart from '../components/examenes/ExamBeforeStart.vue'
import ExamCard from '../components/examenes/ExamCard.vue'
import ExamSideProgress from '../components/examenes/ExamSideProgress.vue'
import ExamSideWhyLogin from '../components/examenes/ExamSideWhyLogin.vue'
import ExamStartDialog from '../components/examenes/ExamStartDialog.vue'
import ExamPortrait from '../components/common/ExamPortrait.vue'
import { useExamAccess } from '../composables/useExamAccess'
import { useI18n } from '../i18n'

// Página REACTIVA a la sesión (useAuth): sin sesión se ve el aviso de acceso y los exámenes bloqueados
// sin botones; con sesión se ve el avance y cada examen según su estado (ver useExamAccess).
const { t } = useI18n()
const e = computed(() => t.value.examenes)
const access = useExamAccess()
const { isLoggedIn } = access

const option = ref(0) // 0 diagnóstica · 1 post recorrido
const optionStatuses = computed(() => [0, 1].map((o) => access.optionStatus(o)))
const statuses = computed(() => [0, 1].map((o) => [0, 1].map((m) => access.statusOf(o, m))))

// Presentar un examen: confirmación + (pendiente) llamada al backend.
const dialog = ref(null)
const pending = ref(0)
const started = ref(false)
const pendingName = computed(
  () => `${e.value.card.title(pending.value + 1)} (${e.value.picker.options[option.value].title})`,
)
function onStart(mod) {
  pending.value = mod
  dialog.value?.open()
}
// TODO: aquí se llamará al endpoint de "iniciar/reanudar intento" cuando exista el contrato en el backend.
// Mientras tanto se avisa que estará disponible pronto.
const onConfirm = () => (started.value = true)
watch([option, isLoggedIn], () => (started.value = false))
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
                @start="onStart(m - 1)"
              />
            </div>
          </section>
        </Transition>

        <p v-if="started" class="card exam-status" role="status">
          <AppIcon name="bulb" :size="18" />{{ e.startSoon }}
        </p>
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

    <ExamStartDialog ref="dialog" :name="pendingName" @confirm="onConfirm" />
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

.layout { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 24px; align-items: start; }
.col { min-width: 0; display: grid; gap: 18px;}
.exam-panel { display: grid; gap: 18px;}
.intro { padding: 0; }
.intro h2 { font-size: 24px; font-weight: 700; }
.intro p { margin-top: 6px; color: var(--ink-2); }
.exams { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.exam-status { display: flex; align-items: center; gap: 10px; padding: 14px 18px; font-size: 14.5px; font-weight: 600; color: var(--ink-teal); background: var(--tint-green); }

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
