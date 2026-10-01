<script setup>
import { computed, nextTick, ref } from 'vue'
import GuideStep from '../GuideStep.vue'
import RichText from '../../common/RichText.vue'
import AppIcon from '../../common/AppIcon.vue'
import { useI18n } from '../../../i18n'

const { t } = useI18n()
const s = computed(() => t.value.guias.s3)
const quiz = computed(() => s.value.quiz)
const total = computed(() => quiz.value.questions.length)

// Se guardan las respuestas (no los textos): así el feedback cambia de idioma al instante.
const answers = ref([]) // 's' | 'a' por pregunta
const picked = ref(null) // respuesta elegida en la pregunta actual (antes de pasar a la siguiente)
const index = ref(0)
const score = computed(() => answers.value.filter((a, i) => a === quiz.value.questions[i].a).length)
const done = computed(() => index.value >= total.value)
const question = computed(() => quiz.value.questions[index.value])
const isRight = computed(() => picked.value && picked.value === question.value.a)
const nextBtn = ref(null)

function answer(v) {
  if (picked.value) return
  picked.value = v
  answers.value = [...answers.value, v]
  nextTick(() => nextBtn.value?.focus())
}
function next() {
  picked.value = null
  index.value++
}
function retry() {
  answers.value = []
  picked.value = null
  index.value = 0
}
function pipState(i) {
  if (i < answers.value.length) return answers.value[i] === quiz.value.questions[i].a ? 'ok' : 'no'
  return i === index.value ? 'cur' : ''
}
const answerName = (k) => (k === 's' ? quiz.value.sensor : quiz.value.actuator)
</script>

<template>
  <GuideStep :n="3" :title="s.title" :kicker="s.kicker" :note="s.note" note-icon="bulb">
    <p>{{ s.body }}</p>
    <div class="duo">
      <div class="g-tile dc g-in">
        <span class="g-ico"><AppIcon name="eye" :size="28" /></span>
        <b>{{ s.sensor.title }}</b>
        <span class="g-tx"><RichText :text="s.sensor.text" /></span>
      </div>
      <div class="g-tile dc g-pr">
        <span class="g-ico"><AppIcon name="hand" :size="28" /></span>
        <b>{{ s.actuator.title }}</b>
        <span class="g-tx"><RichText :text="s.actuator.text" /></span>
      </div>
    </div>

    <template #play>
      <div class="pips" role="img" :aria-label="quiz.progress(Math.min(index + 1, total), total)">
        <span v-for="(_, i) in total" :key="i" class="pip" :class="pipState(i)"></span>
      </div>

      <template v-if="!done">
        <p class="cnt">{{ quiz.progress(index + 1, total) }}</p>
        <p class="q">{{ question.q }}</p>

        <div class="opts">
          <button
            v-for="o in ['s', 'a']"
            :key="o"
            type="button"
            class="opt"
            :class="[o === 's' ? 'g-in' : 'g-pr', { right: picked && o === question.a, wrong: picked === o && o !== question.a }]"
            :disabled="!!picked"
            @click="answer(o)"
          >
            <span class="g-ico"><AppIcon :name="o === 's' ? 'eye' : 'hand'" :size="24" /></span>
            {{ answerName(o) }}
          </button>
        </div>

        <div class="fb" aria-live="polite">
          <template v-if="picked">
            <p :class="isRight ? 'ok' : 'no'">
              <AppIcon :name="isRight ? 'check' : 'alert'" :size="18" />
              {{ isRight ? quiz.right : quiz.wrong(answerName(question.a)) }}
            </p>
            <p class="why">{{ question.why }}</p>
          </template>
        </div>

        <button v-if="picked" ref="nextBtn" type="button" class="btn btn-primary" @click="next">
          {{ index + 1 < total ? quiz.next : quiz.seeResult }}
          <AppIcon name="chevron-right" :size="18" />
        </button>
      </template>

      <div v-else class="result">
        <span class="trophy"><AppIcon name="star" :size="30" /></span>
        <p class="q">{{ quiz.result(score, total) }}</p>
        <button type="button" class="btn btn-ghost" @click="retry">
          <AppIcon name="refresh" :size="18" />{{ quiz.retry }}
        </button>
      </div>
    </template>
  </GuideStep>
</template>

<style scoped>
.duo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 4px; }
.dc { padding: 16px; }
.dc b { font-size: 17px; }

.pips { display: flex; gap: 6px; margin-bottom: 12px; }
.pip { flex: 1; height: 8px; border-radius: 9px; background: var(--line); transition: background-color 0.3s ease; }
.pip.cur { background: var(--blue-900); opacity: 0.5; }
.pip.ok { background: var(--out); }
.pip.no { background: var(--pr); }

.cnt { font-size: 13px; font-weight: 700; color: var(--teal-600); }
.q { font-size: 18px; font-weight: 600; margin: 6px 0 14px; color: var(--ink); }

.opts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.opt {
  display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px 16px;
  border: 3px solid transparent; border-radius: 16px; background: var(--t); color: var(--ct);
  font-size: 16px; font-weight: 700; cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.opt .g-ico { width: 42px; height: 42px; border-radius: 12px; background: #fff; display: grid; place-items: center; transition: transform 0.25s ease; }
.opt:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(20, 40, 80, 0.12); border-color: var(--c); }
.opt:hover:not(:disabled) .g-ico { transform: scale(1.1) rotate(-6deg); }
.opt:disabled { cursor: default; }
.opt.right { border-color: var(--out); box-shadow: 0 0 0 3px var(--tint-out); }
.opt.wrong { border-color: var(--pr); }

.fb { min-height: 64px; margin: 14px 0 6px; }
.fb p:first-child { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.ok { color: var(--ink-out); }
.no { color: var(--ink-pr); }
.why { margin-top: 2px; font-size: 14px; color: var(--ink-2); }

.result { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.trophy { width: 56px; height: 56px; border-radius: 16px; background: var(--grad); color: #fff; display: grid; place-items: center; }

@media (max-width: 640px) { .duo, .opts { grid-template-columns: minmax(0, 1fr); } }
</style>
