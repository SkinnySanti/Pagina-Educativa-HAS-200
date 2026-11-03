<script setup>
import { computed } from 'vue'
import AppIcon from '../common/AppIcon.vue'
import { useI18n } from '../../i18n'
import { GOAL } from '../../utils/feedbackStats.js'

// Bloques informativos de los estados sin datos (sin sesión / sin intentos): qué se verá aquí y cómo se construye.
const props = defineProps({ mode: { type: String, default: 'empty' } }) // 'empty' | 'nologin'
const { t } = useI18n()
const i = computed(() => t.value.retro.info)
const levels = computed(() => t.value.retro.skills.levels)
</script>

<template>
  <section class="re-sec" aria-labelledby="re-what">
    <div class="intro"><h2 id="re-what">{{ i.whatTitle }}</h2><p>{{ i.whatText }}</p></div>
    <div class="re-info-grid">
      <article v-for="f in i.features" :key="f.title" class="card re-info">
        <span class="re-ico"><AppIcon :name="f.icon" :size="22" /></span>
        <div class="t"><h3>{{ f.title }}</h3><p>{{ f.text }}</p></div>
      </article>
    </div>
  </section>

  <section class="re-sec" aria-labelledby="re-how">
    <div class="intro"><h2 id="re-how">{{ i.howTitle }}</h2><p>{{ i.howText }}</p></div>
    <div class="re-two">
      <ol class="card re-steps" :aria-label="i.stepsLabel">
        <li v-for="(st, k) in i.steps" :key="k">
          <span class="d">{{ k + 1 }}</span>
          <div><b>{{ st[0] }}</b><span class="s">{{ st[1] }}</span></div>
        </li>
      </ol>
      <div class="stack">
        <section v-if="mode === 'nologin'" class="card re-facts" aria-labelledby="re-why-t">
          <h3 id="re-why-t">{{ i.whyTitle }}</h3>
          <ul>
            <li v-for="w in i.why" :key="w.title">
              <AppIcon :name="w.icon" :size="18" /><span><b>{{ w.title }}.</b> {{ w.text }}</span>
            </li>
          </ul>
        </section>
        <section v-else class="card re-facts" aria-labelledby="re-before-t">
          <h3 id="re-before-t">{{ i.beforeTitle }}</h3>
          <ul>
            <li v-for="b in i.before" :key="b"><AppIcon name="check" :size="18" /><span>{{ b }}</span></li>
          </ul>
        </section>

        <section class="card re-facts" aria-labelledby="re-lv-t">
          <h3 id="re-lv-t">{{ i.levelsTitle }}</h3>
          <p>{{ i.levelsText }}</p>
          <div class="re-levels">
            <span class="re-level f"><AppIcon name="check" :size="13" />{{ levels.f }} · {{ GOAL }} %+</span>
            <span class="re-level p"><AppIcon name="clock" :size="13" />{{ levels.p }}</span>
            <span class="re-level r"><AppIcon name="alert" :size="13" />{{ levels.r }}</span>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
