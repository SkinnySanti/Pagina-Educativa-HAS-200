<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { mmss } from '../../utils/feedbackStats.js'

// Todos los intentos (enviados y vencidos). Solo los enviados tienen revisión: el botón abre /examenes con esa revisión.
defineProps({ attempts: { type: Array, required: true } })
const { lang, t } = useI18n()
const h = computed(() => t.value.retro.history)
const mod = (n) => t.value.retro.module(n)

const fmtDate = (iso) =>
  new Date(iso)
    .toLocaleDateString(lang.value === 'en' ? 'en-US' : 'es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Bogota' })
    .replace('.', '')
const reviewTo = (a) => ({ path: '/examenes', query: { revision: String(a.id), tipo: a.tipo, modulo: String(a.modulo) } })
</script>

<template>
  <div class="card re-table-wrap">
    <table class="re-table">
      <thead>
        <tr>
          <th scope="col">{{ h.cols.exam }}</th>
          <th scope="col">{{ h.cols.date }}</th>
          <th scope="col">{{ h.cols.state }}</th>
          <th scope="col">{{ h.cols.score }}</th>
          <th scope="col">{{ h.cols.time }}</th>
          <th scope="col"><span class="visually-hidden">{{ h.cols.review }}</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in attempts" :key="a.id">
          <td class="ex"><b>{{ h.types[a.tipo] ?? a.tipo }}</b><span>{{ mod(a.modulo) }}</span></td>
          <td>{{ fmtDate(a.fecha) }}</td>
          <td>
            <span v-if="a.estado === 'ENVIADO'" class="re-st"><AppIcon name="check" :size="13" />{{ h.states.ENVIADO }}</span>
            <span v-else class="re-st v"><AppIcon name="clock" :size="13" />{{ h.states.VENCIDO }}</span>
          </td>
          <td>
            <span v-if="a.puntaje === null" class="dash">—</span>
            <template v-else><b>{{ a.puntaje }} %</b> <span class="dash">({{ a.aciertos }}/{{ a.total }})</span></template>
          </td>
          <td>
            <span v-if="a.segundos === null" class="dash">—</span>
            <template v-else>{{ h.minutes(mmss(a.segundos)) }}</template>
          </td>
          <td>
            <RouterLink v-if="a.estado === 'ENVIADO'" :to="reviewTo(a)" class="btn btn-ghost btn-sm">
              <AppIcon name="eye" :size="16" />{{ h.review }}
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
