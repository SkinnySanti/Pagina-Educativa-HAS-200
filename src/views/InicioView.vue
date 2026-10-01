<script setup>
import HeroBanner from '../components/inicio/HeroBanner.vue'
import WelcomeIntro from '../components/inicio/WelcomeIntro.vue'
import HasPyramid from '../components/inicio/HasPyramid.vue'
import LearningPath from '../components/inicio/LearningPath.vue'
import InfoNotices from '../components/inicio/InfoNotices.vue'
import RevealOnScroll from '../components/common/RevealOnScroll.vue'

// se movió fuera de Inicio: esta página es un índice, no un manual.
// reutilizarse dentro del futuro módulo de Guías.
</script>

<template>
  <div class="content">
    <!-- El hero se ve de inmediato al cargar: no se anima al entrar,
         solo los bloques que aparecen al hacer scroll. -->
    <HeroBanner />
    <RevealOnScroll><WelcomeIntro /></RevealOnScroll>
    <RevealOnScroll><HasPyramid /></RevealOnScroll>
    <RevealOnScroll><LearningPath /></RevealOnScroll>
    <RevealOnScroll><InfoNotices /></RevealOnScroll>
  </div>
</template>

<style scoped>
.content { padding: 28px; max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
@media (max-width: 960px) {
  .content { padding: 16px; gap: 20px; }
}
</style>
