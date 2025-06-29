import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomePage from '@/pages/HomePage.vue'
import LoginComponent from '@/components/LoginComponent.vue'
import { jwtDecode } from 'jwt-decode'
import { useUserStore } from '@/stores/users'

// Páginas protegidas
import PageDosis from '@/pages/PageDosis.vue'
import PageAreaSalud from '@/pages/PageAreaSalud.vue'
import PageFabricantes from '@/pages/PageFabricantes.vue'
import PageLotes from '@/pages/PageLotes.vue'
import PagePacientes from '@/pages/PagePacientes.vue'
import PagePais from '@/pages/PagePais.vue'
import PageVacunas from '@/pages/PageVacunas.vue'
import PageForbidden from '@/pages/PageForbidden.vue'

const routes = [
  {
    path: '/login',
    component: LoginComponent
  },
  {
    path: '/forbidden',
    component: PageForbidden 
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', redirect: 'inicio' },
      {
        path: 'inicio',
        name: 'Inicio',
        component: HomePage,
        meta: { requiresAuth: true, roles: ['admin', 'health'] }
      },
      {
        path: 'dosis',
        name: 'Dosis',
        component: PageDosis,
        meta: { requiresAuth: true, roles: ['admin', 'health'] }
      },
      {
        path: 'area-salud',
        name: 'Areas de Salud',
        component: PageAreaSalud,
        meta: { requiresAuth: true, roles: ['admin'] }
      },
      {
        path: 'fabricantes',
        name: 'Fabricantes',
        component: PageFabricantes,
        meta: { requiresAuth: true, roles: ['admin'] }
      },
      {
        path: 'lotes',
        name: 'Lotes',
        component: PageLotes,
        meta: { requiresAuth: true, roles: ['admin'] }
      },
      {
        path: 'pacientes',
        name: 'Pacientes',
        component: PagePacientes,
        meta: { requiresAuth: true, roles: ['admin'] }
      },
      {
        path: 'pais',
        name: 'País',
        component: PagePais,
        meta: { requiresAuth: true, roles: ['admin'] }
      },
      {
        path: 'vacunas',
        name: 'Vacunas',
        component: PageVacunas,
        meta: { requiresAuth: true, roles: ['admin'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Guard global de navegación:
 * - Verifica token presente y válido
 * - Verifica expiración del token
 * - Verifica permisos por rol según meta.roles
 * - Redirige según corresponda
 */
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')

  // Si la ruta requiere autenticación y no hay token, lo mandamos al login
  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login', query: { reason: 'required' } })
  }

  if (token) {
    try {
      // Decodificamos el token
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      // Verificamos expiración
      if (decoded.exp && decoded.exp < currentTime) {
        userStore.logout()
        return next({ path: '/login', query: { reason: 'expired' } })
      }

    } catch {
      // Token inválido (no decodificable)
      userStore.logout()
      return next({ path: '/login', query: { reason: 'invalid' } })
    }
  }

  // Si está logueado y quiere ir al login, lo mandamos al inicio
  if (to.path === '/login' && token) {
    return next('/inicio')
  }

  // Si la ruta tiene roles definidos, validamos
  if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
    // No tiene permisos: lo mandamos al inicio o a un 403 si prefieres
    return next('/forbidden') // Si usas una página 403
  }

  // Si todo bien, continuamos
  next()
})

export default router
