<script setup>
import { computed, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.s6)

const icons = ['factory', 'layers', 'eye', 'gear', 'bolt', 'alert']
const flipped = ref(new Set())
const allFlipped = computed(() => flipped.value.size === s.value.terms.length)

function toggle(i) {
  const next = new Set(flipped.value)
  next.has(i) ? next.delete(i) : next.add(i)
  flipped.value = next
}
function toggleAll() {
  flipped.value = allFlipped.value ? new Set() : new Set(s.value.terms.map((_, i) => i))
}
</script>

<template>
  <GuideStep :n="6" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="book">
    <p>{{ s.body }}</p>

    <template #play>
      <div class="gl">
        <button
          v-for="(g, i) in s.terms"
          :key="i"
          type="button"
          class="fc"
          :class="{ f: flipped.has(i) }"
          :aria-pressed="flipped.has(i)"
          :aria-label="s.cardAria(g.term, flipped.has(i))"
          @click="toggle(i)"
        >
          <span class="fi">
            <span class="fr">
              <span class="fico"><AppIcon :name="icons[i]" :size="24" /></span>
              {{ g.term }}
            </span>
            <span class="bk"><b>{{ g.term }}</b>{{ g.def }}</span>
          </span>
        </button>
      </div>

      <p class="all">
        <button type="button" class="btn btn-ghost" @click="toggleAll">
          <AppIcon name="refresh" :size="18" />{{ allFlipped ? s.hideAll : s.flipAll }}
        </button>
      </p>
    </template>
  </GuideStep>
</template>

<style scoped>
.gl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.fc { position: relative; height: 168px; perspective: 800px; border: 0; background: none; padding: 0; cursor: pointer; transition: transform 0.2s ease, filter 0.2s ease; }
.fc:hover { transform: translateY(-4px); filter: drop-shadow(0 12px 18px rgba(20, 40, 80, 0.16)); }
.fi { position: absolute; inset: 0; transition: transform 0.5s ease; transform-style: preserve-3d; }
.fc.f .fi { transform: rotateY(180deg); }
.fr, .bk {
  position: absolute; inset: 0; backface-visibility: hidden; border-radius: 16px; padding: 14px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center;
}
.fr { background: var(--grad); color: #fff; font-weight: 700; font-size: 16px; }
.fico { width: 44px; height: 44px; border-radius: 12px; background: rgba(255, 255, 255, 0.18); display: grid; place-items: center; transition: transform 0.25s ease; }
.fc:hover .fico { transform: scale(1.1) rotate(-6deg); }
.bk { background: var(--tint-blue); color: var(--ink); transform: rotateY(180deg); font-size: 13.5px; line-height: 1.4; }
.bk b { color: var(--blue-900); font-size: 14.5px; }
.all { margin-top: 14px; }

@media (max-width: 960px) { .gl { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 480px) { .fc { height: 196px; } }
</style>
