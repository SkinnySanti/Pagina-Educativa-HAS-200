<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import '../styles/retro.css'
import AppIcon from '../components/common/AppIcon.vue'
import RetroHero from '../components/retro/RetroHero.vue'
import RetroNotice from '../components/retro/RetroNotice.vue'
import RetroInfo from '../components/retro/RetroInfo.vue'
import RetroKpis from '../components/retro/RetroKpis.vue'
import RetroProgress from '../components/retro/RetroProgress.vue'
import RetroCompare from '../components/retro/RetroCompare.vue'
import RetroRadar from '../components/retro/RetroRadar.vue'
import RetroSkills from '../components/retro/RetroSkills.vue'
import RetroErrors from '../components/retro/RetroErrors.vue'
import RetroHistory from '../components/retro/RetroHistory.vue'
import RetroSide from '../components/retro/RetroSide.vue'
import RetroReportDialog from '../components/retro/RetroReportDialog.vue'
import { useAuth } from '../composables/useAuth'
import { useFeedback } from '../composables/useFeedback'
import { useI18n } from '../i18n'
import { basisOf, buildSkills, kpis, progressSeries } from '../utils/feedbackStats'

// Página REACTIVA a la sesión (como Exámenes): sin sesión se ve el aviso de acceso y qué se encontrará aquí;
// con sesión, los datos propios. Orden de la pantalla: Hero → 4 tarjetas de estadísticas a todo el ancho →
// debajo, la columna principal (gráficas, errores, historial) con el lateral al costado.
const { t } = useI18n()
const r = computed(() => t.value.retro)
const fb = useFeedback()
const { isLoggedIn, state, data, error, sample, empty } = fb

const showData = computed(() => state.value === 'ready' && !empty.value && !!data.value)
const stats = computed(() => (showData.value ? kpis(data.value) : null))
const progress = computed(() => (showData.value ? progressSeries(data.value) : { series: [], labels: [] }))
const skills = computed(() => (showData.value ? buildSkills(data.value) : []))
const basis = computed(() => basisOf(skills.value))
const sortedAttempts = computed(() => [...(data.value?.attempts ?? [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)))

// Filtro de errores por habilidad: lo comparten las tarjetas de habilidades y los chips de la sección de errores.
const filter = ref('ALL')
const pickSkill = (k) => (filter.value = filter.value === k ? 'ALL' : k)

const errorText = computed(() => {
  const e = error.value
  const m = r.value.state.errors
  if (!e) return ''
  if (e.code === 'network') return m.network
  if (e.code === 'session') return m.session
  if (e.code === 'rate') return m.rate
  return m.generic
})

const { alias } = useAuth()
const reportOpen = ref(false) // vista previa del reporte (certificado) con el botón "Descargar PDF"
</script>

<template>
  <div class="retro content">
    <nav class="crumbs" :aria-label="r.crumbs.label">
      <RouterLink to="/">{{ r.crumbs.home }}</RouterLink>
      <AppIcon name="chevron-right" :size="14" />
      <b aria-current="page">{{ r.crumbs.current }}</b>
    </nav>

    <RetroHero :can-print="showData" @print="reportOpen = true" />

    <!-- Sin sesión -->
    <template v-if="!isLoggedIn">
      <RetroNotice kind="login" />
      <div class="re-layout single"><div class="re-col"><RetroInfo mode="nologin" /></div></div>
    </template>

    <!-- Cargando -->
    <p v-else-if="state === 'loading' || state === 'idle'" class="card re-status" role="status">
      <AppIcon name="clock" :size="18" /><span>{{ r.state.loading }}</span>
    </p>

    <!-- Error al cargar -->
    <p v-else-if="state === 'error'" class="card re-status err" role="alert">
      <AppIcon name="alert" :size="18" /><span>{{ errorText }}</span>
      <button type="button" class="btn btn-ghost btn-sm" @click="fb.reload()">{{ r.state.retry }}</button>
    </p>

    <!-- Con sesión pero sin intentos enviados -->
    <template v-else-if="empty">
      <RetroNotice kind="empty" />
      <div class="re-layout single"><div class="re-col"><RetroInfo mode="empty" /></div></div>
    </template>

    <!-- Con datos -->
    <template v-else-if="showData">
      <p v-if="sample" class="re-note" role="note"><AppIcon name="alert" :size="18" /><span>{{ r.state.sample }}</span></p>

      <!-- Las 4 tarjetas ocupan todo el ancho, alineadas con el Hero -->
      <RetroKpis :stats="stats" />

      <div class="re-layout">
        <div class="re-col">
          <RetroProgress v-if="progress.series.length" :progress="progress" />

          <RetroCompare :compare="data.compare" />

          <section class="re-sec" aria-labelledby="re-h-sk">
            <div class="intro"><h2 id="re-h-sk">{{ r.skills.title }}</h2><p>{{ r.skills.text }}</p></div>
            <RetroRadar :skills="skills" />
            <RetroSkills :skills="skills" :mode="basis" :active="filter" @select="pickSkill" />
          </section>

          <section id="re-errores" class="re-sec" aria-labelledby="re-h-err">
            <div class="intro"><h2 id="re-h-err">{{ r.errors.title }}</h2><p>{{ r.errors.text }}</p></div>
            <RetroErrors v-model="filter" :errors="data.errors" />
          </section>

          <section class="re-sec" aria-labelledby="re-h-his">
            <div class="intro"><h2 id="re-h-his">{{ r.history.title }}</h2><p>{{ r.history.text }}</p></div>
            <RetroHistory :attempts="sortedAttempts" />
          </section>
        </div>

        <RetroSide :skills="skills" :errors="data.errors" />
      </div>

      <RetroReportDialog
        v-if="reportOpen"
        :alias="alias"
        :stats="stats"
        :skills="skills"
        :compare="data.compare"
        :errors="data.errors"
        :basis="basis"
        @close="reportOpen = false"
      />
    </template>
  </div>
</template>
