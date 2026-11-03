<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { MODULES, SKILL_KEYS, pct, signed } from '../../utils/feedbackStats.js'

// Diagnóstica vs. post, en un contenedor con encabezado (igual que "Evolución de tus puntajes").
// Una tarjeta por módulo: si hay ambos exámenes, el cambio por habilidad; si falta alguno, una tarjeta
// ilustrada con recomendaciones y el botón para ir a los exámenes.
const props = defineProps({ compare: { type: Object, required: true } })
const { t } = useI18n()
const c = computed(() => t.value.retro.compare)
const pg = computed(() => t.value.retro.progress)
const names = computed(() => t.value.retro.skills.list)
const mod = (n) => t.value.retro.module(n)

const cards = computed(() =>
  MODULES.map((m) => {
    const d = props.compare[m]
    if (!d?.diag || !d?.post) return { m, missing: d?.diag ? 'post' : 'diag' }
    const delta = d.post.puntaje - d.diag.puntaje
    const rows = SKILL_KEYS.map((k) => {
      const dg = d.skills[k]?.diag
      const ps = d.skills[k]?.post
      if (!dg || !ps) return null
      const dl = ps[0] - dg[0]
      return { k, dg, ps, dl, cls: dl > 0 ? 'up' : dl < 0 ? 'down' : 'same' }
    }).filter(Boolean)
    return { m, delta, cls: delta > 0 ? 'up' : delta < 0 ? 'down' : 'same', diag: d.diag.puntaje, post: d.post.puntaje, rows }
  }),
)
</script>

<template>
  <section class="card re-prog re-cmpbox" aria-labelledby="re-cmp-title">
    <header class="re-prog-head">
      <span class="re-ico"><AppIcon name="refresh" :size="24" /></span>
      <div class="ttl">
        <h2 id="re-cmp-title">{{ c.title }}</h2>
        <p>{{ c.text }}</p>
      </div>
      <ul class="re-prog-legend">
        <li><span class="sw diag"></span>{{ pg.diag }}</li>
        <li><span class="sw post"></span>{{ pg.legendPost }}</li>
      </ul>
    </header>

    <div class="re-cmp">
      <article v-for="x in cards" :key="x.m" class="re-cmp-card" :class="{ pend: x.missing }">
        <div class="re-cmp-top">
          <span class="re-tag">{{ mod(x.m) }}</span>
          <span v-if="x.missing" class="re-pill same">{{ c.pending }}</span>
          <span v-else class="re-pill" :class="x.cls">{{ c.pts(signed(x.delta)) }}</span>
        </div>

        <template v-if="!x.missing">
          <div class="re-score">
            <span class="a">{{ x.diag }} %</span>
            <span class="arrow" aria-hidden="true"><AppIcon name="chevron-right" :size="18" /></span>
            <span class="b">{{ x.post }} %</span>
            <span class="t">{{ c.arrowLabel }}</span>
          </div>
          <div class="re-rows">
            <div v-for="r in x.rows" :key="r.k" class="re-row">
              <div class="head">
                <b>{{ names[r.k].name }}</b>
                <span class="re-pill" :class="r.cls">{{ r.dl === 0 ? c.same : c.delta(signed(r.dl), r.dl) }}</span>
              </div>
              <div class="re-pair">
                <span>{{ c.diagShort }}</span>
                <div class="re-bar"><i :style="{ width: `${pct(r.dg[0], r.dg[1])}%` }"></i></div>
                <span class="val">{{ r.dg[0] }}/{{ r.dg[1] }}</span>
              </div>
              <div class="re-pair post">
                <span>{{ c.postShort }}</span>
                <div class="re-bar"><i :style="{ width: `${pct(r.ps[0], r.ps[1])}%` }"></i></div>
                <span class="val">{{ r.ps[0] }}/{{ r.ps[1] }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Falta la diagnóstica o el post: ilustración + recomendaciones + botón -->
        <div v-else class="re-pend">
          <svg class="art" viewBox="0 0 160 110" aria-hidden="true">
            <rect class="bg" x="6" y="10" width="148" height="94" rx="16" />
            <rect class="sheet" x="40" y="18" width="64" height="80" rx="9" />
            <rect class="line" x="50" y="32" width="34" height="6" rx="3" />
            <rect class="line" x="50" y="46" width="44" height="6" rx="3" />
            <rect class="line" x="50" y="60" width="28" height="6" rx="3" />
            <g v-if="x.missing === 'diag'">
              <path class="flag-pole" d="M118 92V44" />
              <path class="flag" d="M118 44l24 8-24 10z" />
            </g>
            <g v-else>
              <rect class="bar1" x="108" y="70" width="10" height="22" rx="3" />
              <rect class="bar2" x="122" y="54" width="10" height="38" rx="3" />
              <rect class="bar3" x="136" y="38" width="10" height="54" rx="3" />
            </g>
            <circle class="badge" cx="96" cy="88" r="14" />
            <path class="tick" d="M89 88l5 5 9-10" />
          </svg>
          <h3>{{ c.missing[x.missing].title }}</h3>
          <p>{{ c.missing[x.missing].text }}</p>
          <ul class="tips">
            <li v-for="tp in c.missing[x.missing].tips" :key="tp"><AppIcon name="check" :size="16" /><span>{{ tp }}</span></li>
          </ul>
          <RouterLink to="/examenes" class="btn btn-primary"><AppIcon name="clipboard" :size="18" />{{ c.goExams }}</RouterLink>
        </div>
      </article>
    </div>

  </section>
</template>
