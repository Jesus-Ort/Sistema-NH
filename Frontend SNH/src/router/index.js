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
        meta: { requiresAuth: true, roles: ['admin',] }
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


router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = localStorage.getItem('token')

  // Si requiere auth y no hay token → al login
  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login', query: { reason: 'required' } })
  }

  // Si hay token, validamos expiración
  if (token) {
    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        userStore.logout()
        return next({ path: '/login', query: { reason: 'expired' } })
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      userStore.logout()
      return next({ path: '/login', query: { reason: 'invalid' } })
    }
  }

  // Si la ruta tiene roles definidos, validamos el rol
  if (to.meta.roles) {
    if (!to.meta.roles.includes(userStore.role)) {
      return next('/forbidden')
    }
  }

  // Si todo bien, sigue
  next()
})


export default router
