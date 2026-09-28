import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'

// Un módulo nuevo = una ruta nueva aquí + un ítem en AppSidebar.vue.
// Guías, Exámenes y Retroalimentación se agregan cuando estén terminados.
const routes = [
  { path: '/', name: 'inicio', component: InicioView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
