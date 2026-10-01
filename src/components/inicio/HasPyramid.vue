<script setup>
import { computed, ref } from 'vue'
import RichText from '../common/RichText.vue'
import { useI18n } from '../../i18n'

const { t } = useI18n()
const p = computed(() => t.value.pyramid)

const levels = [
  { key: 'field', pts: '30,250 370,250 340,208 60,208', y: 233 },
  { key: 'control', pts: '63,204 337,204 307,166 93,166', y: 189 },
  { key: 'scada', pts: '96,162 304,162 274,124 126,124', y: 147 },
  { key: 'mes', pts: '129,120 271,120 241,82 159,82', y: 105 },
  { key: 'erp', pts: '162,78 238,78 215,40 185,40', y: 63 },
]

const activeKey = ref(null)
const pinnedKey = ref(null)

function show(level) {
  activeKey.value = level.key
}

function hide(level) {
  if (pinnedKey.value !== level.key) activeKey.value = pinnedKey.value
}

function toggle(level) {
  pinnedKey.value = pinnedKey.value === level.key ? null : level.key
  activeKey.value = pinnedKey.value
}

function focusLevel(level) {
  show(level)
}

function blurLevel() {
  activeKey.value = pinnedKey.value
}

function isActive(level) {
  return activeKey.value === level.key
}

const activeLevel = computed(() => levels.find((level) => level.key === activeKey.value) ?? null)
const tooltipTop = computed(() => activeLevel.value ? `${(activeLevel.value.y / 268) * 100}%` : '50%')
const activeData = computed(() => activeLevel.value ? p.value.levels[activeLevel.value.key] : null)
</script>

<template>
  <section class="pyramid-section" aria-labelledby="pyramid-title">
    <div class="card pyramid-box">
      <div class="copy">
        <h2 id="pyramid-title">{{ p.title }}</h2>
        <p>{{ p.text }}</p>
      </div>

      <div class="diagram">
        <figure class="pyramid-fig">
          <div class="stage">
            <svg
              viewBox="0 0 400 268"
              role="img"
              :aria-label="p.ariaLabel"
            >
              <g
                v-for="level in levels"
                :key="level.key"
                class="level"
                :class="{ muted: !p.levels[level.key].inScope, active: isActive(level) }"
                tabindex="0"
                role="button"
                :aria-label="`${p.levels[level.key].label}: ${p.levels[level.key].desc}`"
                @mouseenter="show(level)"
                @mouseleave="hide(level)"
                @focus="focusLevel(level)"
                @blur="blurLevel"
                @click="toggle(level)"
                @keydown.enter.prevent="toggle(level)"
                @keydown.space.prevent="toggle(level)"
              >
                <polygon :points="level.pts" />
                <text :y="level.y" x="200" text-anchor="middle">{{ p.levels[level.key].label }}</text>
              </g>
            </svg>

            <div
              class="tooltip"
              :class="{ show: activeData }"
              :style="{ top: tooltipTop }"
              role="status"
              aria-live="polite"
            >
              <span class="tag" :class="{ out: activeData && !activeData.inScope }">
                {{ activeData?.inScope ? p.inScope : p.outScope }}
              </span>
              <p>
                <strong>{{ activeData?.label }}.</strong>
                {{ activeData?.desc }}
              </p>
            </div>
          </div>
          <p class="hint"><RichText :text="p.hint" /></p>
          <figcaption>{{ p.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pyramid-section { scroll-margin-top: calc(var(--header-h) + 12px); }
.pyramid-box {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 380px);
  align-items: center;
  gap: 28px;
  padding: 24px 28px;
}
.copy h2 { font-size: 22px; font-weight: 700; line-height: 1.25; }
.copy p { color: var(--ink-2); max-width: 54ch; margin-top: 10px; }

.pyramid-fig { margin: 0; }
.stage { position: relative; width: 100%; max-width: 480px; margin: 0 auto; }
.stage svg { width: 100%; height: auto; display: block; overflow: visible; }
.level { cursor: pointer; outline: none; }
.level polygon {
  fill: var(--blue-900);
  stroke: var(--bg);
  stroke-width: 2px;
  transform-origin: 50%;
  transform-box: fill-box;
  transition: transform .2s, filter .2s;
}
.level:nth-child(2) polygon { fill: var(--teal-600); }
.level:hover polygon,
.level.active polygon { filter: brightness(1.08); transform: scale(1.035); }
.level:focus-visible polygon { stroke: var(--blue-900); stroke-width: 3px; }
.level text {
  fill: var(--on-grad);
  paint-order: stroke;
  stroke: #0000002e;
  stroke-width: 3px;
  font-size: 13px;
  font-weight: 600;
}
.level.muted polygon { fill: var(--tint-blue); stroke: var(--surface); }
.level.muted text { fill: var(--ink-2); stroke: none; font-size: 12px; font-weight: 500; }
.level.muted:hover polygon,
.level.muted.active polygon { filter: none; fill: var(--tint-muted-hover); }

.tooltip {
  position: absolute;
  left: 50%;
  width: max-content;
  max-width: min(240px, 72vw);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 10px 12px;
  transform: translate(-50%, -100%) translateY(-12px);
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  transition: opacity .15s ease, transform .15s ease;
}
.tooltip.show { opacity: 1; }
.tooltip::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 11px;
  height: 11px;
  background: var(--surface);
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  transform: translateX(-50%) rotate(45deg);
}
.tooltip .tag {
  color: var(--blue-900);
  background: var(--tint-blue);
  border-radius: 999px;
  padding: 2px 9px;
  font-size: 11px;
  font-weight: 700;
}
.tooltip .tag.out { color: var(--ink-2); background: var(--tint-muted); }
.tooltip p { color: var(--ink-2); font-size: 13px; line-height: 1.4; margin: 4px 0 0; }

.hint { text-align: center; font-style: italic; color: var(--ink-2); font-size: 13px; margin-top: 12px; }
figcaption { text-align: center; color: var(--ink-2); margin-top: 6px; font-size: 13px; }

@media (max-width: 880px) {
  .pyramid-box { grid-template-columns: minmax(0, 1fr); }
  .diagram { order: -1; width: 100%; max-width: 360px; margin: 0 auto; }
}

@media (max-width: 960px) {
  .pyramid-box { padding: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .level polygon, .tooltip { transition: none; }
}
</style>
