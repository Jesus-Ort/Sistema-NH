import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Home from '@/pages/HomePage.vue'
import Pacientes from '@/pages/PacientesPage.vue'
import Vacunas from '@/pages/VacunasPage.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: 'pacientes', name: 'Pacientes', component: Pacientes },
      { path: 'vacunas', name: 'Vacunas', component: Vacunas },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router