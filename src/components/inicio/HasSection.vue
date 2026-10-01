<script setup>
import { computed, ref } from 'vue'
import Viewer3D from '../common/Viewer3D.vue'
import PlaceholderBox from '../common/PlaceholderBox.vue'
import ComponentCarousel from './ComponentCarousel.vue'
import { useI18n } from '../../i18n'

const props = defineProps({
  // { id: 'a', model, hotspots, components: [{ img }] }  (viene de src/data/sections.js)
  section: { type: Object, required: true },
  reversed: Boolean, // alterna visor a la izquierda / derecha
})

const { t } = useI18n()

const text = computed(() => t.value.sections[props.section.id])
const domId = computed(() => `sec-${props.section.id}`)

// Une los textos (i18n) con las imágenes (data) de cada componente.
const carouselItems = computed(() =>
  text.value.components.map((c, i) => ({ ...c, img: props.section.components[i]?.img ?? null })),
)

/* ---------- Pestañas accesibles (flechas, Inicio y Fin) ---------- */
const tabs = ['components', 'mechanism', 'operation']
const active = ref('components')
const tabButtons = ref([])

function onKeydown(event, index) {
  const last = tabs.length - 1
  const moves = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last,
  }
  if (!(event.key in moves)) return
  event.preventDefault()
  const next = moves[event.key]
  active.value = tabs[next]
  tabButtons.value[next]?.focus()
}
</script>

<template>
  <section :id="domId" class="block" :aria-labelledby="`${domId}-title`">
    <header class="sec-head">
      <h2 :id="`${domId}-title`">{{ text.title }}</h2>
      <p>{{ text.summary }}</p>
    </header>

    <div class="card sec-grid" :class="{ reversed }">
      <div class="viewer-slot">
        <Viewer3D
          :model="section.model"
          :alt="text.title"
          :hotspots="section.hotspots"
          :label="t.placeholders.sectionModel"
        />
      </div>

      <div class="detail">
        <div class="tabs" role="tablist" :aria-label="t.tabs.detail">
          <button
            v-for="(tab, i) in tabs"
            :key="tab"
            :ref="(el) => (tabButtons[i] = el)"
            :id="`${domId}-tab-${tab}`"
            type="button"
            role="tab"
            :aria-selected="active === tab"
            :aria-controls="`${domId}-panel-${tab}`"
            :tabindex="active === tab ? 0 : -1"
            @click="active = tab"
            @keydown="onKeydown($event, i)"
          >
            {{ t.tabs[tab] }}
          </button>
        </div>

        <div v-show="active === 'components'" :id="`${domId}-panel-components`" role="tabpanel" :aria-labelledby="`${domId}-tab-components`">
          <ComponentCarousel :items="carouselItems" />
        </div>

        <div v-show="active === 'mechanism'" :id="`${domId}-panel-mechanism`" role="tabpanel" :aria-labelledby="`${domId}-tab-mechanism`">
          <div class="mech">
            <PlaceholderBox :label="t.placeholders.mechanismImage" :hint="t.placeholders.image" />
            <dl>
              <div v-for="m in text.mechanism" :key="m.term">
                <dt>{{ m.term }}</dt>
                <dd>{{ m.text }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div v-show="active === 'operation'" :id="`${domId}-panel-operation`" role="tabpanel" :aria-labelledby="`${domId}-tab-operation`">
          <!-- Entrada → Proceso → Salida es una secuencia real, por eso va numerada. -->
          <ol class="steps">
            <li v-for="s in text.steps" :key="s.title">
              <h3>{{ s.title }}</h3>
              <p>{{ s.text }}</p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.block { margin-top: 28px; scroll-margin-top: calc(var(--header-h) + var(--subnav-h) + 8px); }
.block:focus { outline: none; }

.sec-head { margin-bottom: 16px; }
h2 { font-size: 26px; font-weight: 700; line-height: 1.2; }
.sec-head p { margin-top: 6px; color: var(--ink-2); max-width: 60ch; }

.sec-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 24px; padding: 24px; }
.sec-grid.reversed .viewer-slot { order: 2; }
.viewer-slot { min-height: 320px; border-radius: 14px; overflow: hidden; }
.detail { min-width: 0; }

.tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--line); margin-bottom: 18px; overflow-x: auto; }
.tabs button {
  background: none; border: 0; border-bottom: 3px solid transparent; margin-bottom: -1px;
  padding: 10px 16px; font-weight: 600; font-size: 15px; color: var(--ink-2);
  cursor: pointer; white-space: nowrap;
}
.tabs button[aria-selected='true'] { color: var(--blue-900); border-bottom-color: var(--blue-900); }

.mech { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; align-items: start; }
dl { display: grid; gap: 14px; }
dt { font-weight: 600; color: var(--blue-900); }
dd { margin: 2px 0 0; color: var(--ink-2); font-size: 15px; }

.steps { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; counter-reset: step; }
.steps li { counter-increment: step; background: var(--tint-blue); border-radius: 14px; padding: 16px; }
.steps li::before {
  content: counter(step);
  display: grid; place-items: center; width: 28px; height: 28px; margin-bottom: 10px;
  border-radius: 50%; background: var(--blue-900); color: var(--on-accent); font-weight: 700; font-size: 14px;
}
.steps h3 { font-size: 16px; margin-bottom: 4px; }
.steps p { font-size: 14px; color: var(--ink-2); }

@media (max-width: 1100px) {
  .sec-grid { grid-template-columns: minmax(0, 1fr); }
  .sec-grid.reversed .viewer-slot { order: 0; }
}
@media (max-width: 960px) {
  .mech, .steps { grid-template-columns: minmax(0, 1fr); }
  .sec-grid { padding: 16px; }
}
</style>
