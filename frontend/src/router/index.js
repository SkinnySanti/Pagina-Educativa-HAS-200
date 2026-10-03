import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import GuiasView from '../views/GuiasView.vue'

// Un módulo nuevo = una ruta nueva aquí + un ítem en AppSidebar.vue.
// Guías, Exámenes y Retroalimentación se agregan cuando estén terminados.
const routes = [
  { path: '/', name: 'inicio', component: InicioView },
  { path: '/guias', name: 'guias', component: GuiasView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHistory(),
  // Al cambiar de página (Inicio ↔ Guías) se empieza desde arriba.
  scrollBehavior: () => ({ top: 0 }),
  routes,
})
