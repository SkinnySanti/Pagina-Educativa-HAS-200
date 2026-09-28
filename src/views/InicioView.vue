<script setup>
import HeroBanner from '../components/inicio/HeroBanner.vue'
import SectionNav from '../components/inicio/SectionNav.vue'
import HasSection from '../components/inicio/HasSection.vue'
import IntegrationDiagram from '../components/inicio/IntegrationDiagram.vue'
import GlossaryFaq from '../components/inicio/GlossaryFaq.vue'
import { sections } from '../data/sections'
</script>

<template>
  <div class="content">
    <HeroBanner />
    <SectionNav />
    <HasSection v-for="(s, i) in sections" :key="s.id" :section="s" :reversed="i % 2 === 1" />
    <IntegrationDiagram />
    <GlossaryFaq />
  </div>
</template>

<style scoped>
.content { padding: 28px; max-width: 1240px; margin: 0 auto; }
@media (max-width: 960px) {
  .content { padding: 16px; }
}
</style>
