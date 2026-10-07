import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import GuiasView from '../views/GuiasView.vue'
import AuthView from '../views/AuthView.vue'
import { useAuth, authReady } from '../composables/useAuth'

// Un módulo nuevo = una ruta nueva aquí + un ítem en AppSidebar.vue.
// Guías, Exámenes y Retroalimentación se agregan cuando estén terminados.
// meta.layout 'auth' = pantalla sin menú lateral (ver App.vue).
const routes = [
  { path: '/', name: 'inicio', component: InicioView },
  { path: '/guias', name: 'guias', component: GuiasView },
  { path: '/login', name: 'login', component: AuthView, meta: { layout: 'auth', mode: 'login' } },
  { path: '/registro', name: 'registro', component: AuthView, meta: { layout: 'auth', mode: 'register' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  // Al cambiar de página (Inicio ↔ Guías) se empieza desde arriba.
  scrollBehavior: () => ({ top: 0 }),
  routes,
})

// El guard ESPERA a que termine el arranque de la sesión (leer localStorage, renovar y cargar /api/me)
// antes de decidir; si no, un estudiante con sesión válida vería login/registro por un instante.
// - Con la sesión iniciada no tiene sentido ver login/registro.
// - Una ruta con meta.requiresAuth sin sesión lleva al login y vuelve después (query redirect).
router.beforeEach(async (to) => {
  await authReady
  const { isLoggedIn } = useAuth()
  if (to.meta.layout === 'auth' && isLoggedIn.value) return '/'
  if (to.meta.requiresAuth && !isLoggedIn.value) return { name: 'login', query: { redirect: to.fullPath } }
})

// Si la sesión muere estando en una ruta protegida (refresh fallido, cierre en otra pestaña), al login.
watch(useAuth().isLoggedIn, (ok) => {
  const cur = router.currentRoute.value
  if (!ok && cur.meta.requiresAuth) router.push({ name: 'login', query: { redirect: cur.fullPath } })
})

export default router
