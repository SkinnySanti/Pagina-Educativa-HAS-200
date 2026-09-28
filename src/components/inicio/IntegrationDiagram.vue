<script setup>
import { useI18n } from '../../i18n'

const { t } = useI18n()

// Posición de cada nodo del diagrama (coordenadas del SVG).
const nodes = [
  { key: 'a', x: 30 },
  { key: 'b', x: 265 },
  { key: 'c', x: 500 },
]
</script>

<template>
  <section id="integracion" class="block" aria-labelledby="integracion-title">
    <header class="sec-head">
      <h2 id="integracion-title">{{ t.integration.title }}</h2>
      <p>{{ t.integration.text }}</p>
    </header>

    <figure class="card diagram">
      <svg viewBox="0 0 700 220" role="img" aria-labelledby="diagram-alt">
        <title id="diagram-alt">{{ t.integration.alt }}</title>
        <defs>
          <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="#0e9f8a" />
          </marker>
        </defs>

        <g v-for="n in nodes" :key="n.key">
          <rect class="node" :x="n.x" y="70" width="170" height="80" rx="14" />
          <text class="node-text" :x="n.x + 85" y="116">{{ t.sections[n.key].short }}</text>
        </g>

        <path class="arrow" d="M204 110H261" />
        <text class="arrow-text" x="232" y="98">{{ t.integration.signal }}</text>
        <path class="arrow" d="M439 110H496" />
        <text class="arrow-text" x="467" y="98">{{ t.integration.signal }}</text>
      </svg>
      <figcaption>{{ t.integration.caption }}</figcaption>
    </figure>
  </section>
</template>

<style scoped>
.block { margin-top: 28px; scroll-margin-top: calc(var(--header-h) + var(--subnav-h) + 8px); }
.block:focus { outline: none; }
.sec-head { margin-bottom: 16px; }
h2 { font-size: 26px; font-weight: 700; line-height: 1.2; }
.sec-head p { margin-top: 6px; color: var(--ink-2); max-width: 60ch; }

.diagram { padding: 24px; }
svg { width: 100%; height: auto; max-height: 260px; }
.node { fill: var(--tint-blue); stroke: var(--blue-900); stroke-width: 2; }
.node-text { fill: var(--ink); font: 600 15px var(--font); text-anchor: middle; }
.arrow { stroke: var(--teal-600); stroke-width: 3; fill: none; marker-end: url(#arrowhead); }
.arrow-text { fill: var(--ink-2); font: 500 12px var(--font); text-anchor: middle; }
figcaption { margin-top: 8px; text-align: center; font-size: 14px; color: var(--ink-2); }
</style>
